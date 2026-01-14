const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { marked } = require("marked");
const frontMatter = require("front-matter");
const katex = require("katex");
const ejs = require("ejs");
const hljs = require("highlight.js");

// Configuration
const POSTS_DIR = "./posts";
const POSTS_MD_DIR = "./posts-md";
const OUTPUT_DIR = "./posts";
const CACHE_FILE = ".build-cache.json";
const TEMPLATES_DIR = "./templates";

// Site configuration for feeds
const SITE_CONFIG = {
  url: "https://inftape.com",
  title: "InfTape",
  description: "Sam的个人博客 - 记录生活与技术的点滴",
  author: "Sam",
};

// Ensure directories exist
if (!fs.existsSync(POSTS_MD_DIR)) {
  fs.mkdirSync(POSTS_MD_DIR, { recursive: true });
}

// Cache utilities for incremental build
function computeHash(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    }
  } catch (e) {
    console.warn("⚠️  Cache file corrupted, rebuilding from scratch.");
  }
  return { version: 1, posts: {} };
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// KaTeX rendering function
function renderKaTeX(content) {
  // Render display math: $$...$$
  content = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
      });
    } catch (e) {
      console.warn("KaTeX error:", e.message);
      return match;
    }
  });

  // Render inline math: $...$  (but not $$)
  content = content.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch (e) {
      console.warn("KaTeX error:", e.message);
      return match;
    }
  });

  return content;
}

// Configure marked with syntax highlighting (using marked-highlight extension)
const { markedHighlight } = require("marked-highlight");

marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return code; // No auto-detection, return plain code
    },
  })
);

marked.setOptions({
  gfm: true,
  breaks: true,
});

// Helper function to format date
function formatDate(date) {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  if (typeof date === "string") {
    return date;
  }
  return new Date().toISOString().split("T")[0];
}

// Get KaTeX CSS path (local file)
const KATEX_CSS = "../../assets/katex/katex.min.css";

// Read all markdown files and parse them
function readMarkdownPosts() {
  const posts = [];

  if (!fs.existsSync(POSTS_MD_DIR)) {
    console.log(`Creating ${POSTS_MD_DIR} directory...`);
    fs.mkdirSync(POSTS_MD_DIR, { recursive: true });
    return posts;
  }

  const files = fs.readdirSync(POSTS_MD_DIR).filter((f) => f.endsWith(".md"));

  files.forEach((file) => {
    const filePath = path.join(POSTS_MD_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const sourceHash = computeHash(content);
    const { attributes, body } = frontMatter(content);

    const slug = file.replace(".md", "");

    // First render KaTeX, then markdown
    const katexProcessed = renderKaTeX(body);
    const htmlContent = marked(katexProcessed);

    posts.push({
      slug,
      sourceHash,
      title: attributes.title || slug,
      date: formatDate(attributes.date),
      description: attributes.description || "",
      tags: attributes.tags || [],
      content: htmlContent,
    });
  });

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return posts;
}

// Build all posts (with incremental build support)
function build(forceRebuild = false) {
  const startTime = Date.now();
  console.log("🚀 Building blog...\n");

  const posts = readMarkdownPosts();

  if (posts.length === 0) {
    console.log("⚠️  No markdown posts found in posts-md/ directory.");
    console.log("   Create a .md file with front matter like:\n");
    console.log("   ---");
    console.log("   title: My First Post");
    console.log("   date: 2026-01-11");
    console.log("   description: A brief description");
    console.log("   ---");
    console.log("   Your markdown content here...");
    console.log("");
    console.log("   Math support: Use $inline$ or $$display$$ for KaTeX\n");
    return;
  }

  // Load cache for incremental build
  const cache = forceRebuild ? { version: 1, posts: {} } : loadCache();

  // Determine which posts need rebuilding
  const postsToRebuild = [];
  const currentSlugs = new Set();

  posts.forEach((post) => {
    currentSlugs.add(post.slug);
    const cached = cache.posts[post.slug];
    if (!cached || cached.sourceHash !== post.sourceHash) {
      postsToRebuild.push(post);
    }
  });

  // Find deleted posts (in cache but not in current files)
  const deletedSlugs = Object.keys(cache.posts).filter(
    (slug) => !currentSlugs.has(slug)
  );

  // Clean up deleted posts
  deletedSlugs.forEach((slug) => {
    const postDir = path.join(OUTPUT_DIR, slug);
    if (fs.existsSync(postDir)) {
      fs.rmSync(postDir, { recursive: true });
      console.log(`🗑️  Deleted: ${postDir}`);
    }
    delete cache.posts[slug];
  });

  // Check if any changes occurred
  const hasChanges = postsToRebuild.length > 0 || deletedSlugs.length > 0;

  if (!hasChanges && !forceRebuild) {
    console.log("✨ No changes detected, skipping build.");
    console.log(`   (${posts.length} post(s) up to date)`);
    console.log(`   Use --force to rebuild all.\n`);
    return;
  }

  // Ensure posts directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate only changed post pages
  postsToRebuild.forEach((post) => {
    const templatePath = path.join(TEMPLATES_DIR, "post.ejs");
    const template = fs.readFileSync(templatePath, "utf-8");
    const html = ejs.render(
      template,
      { post, katexCSS: KATEX_CSS },
      { filename: templatePath }
    );
    const postDir = path.join(OUTPUT_DIR, post.slug);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }
    const outputPath = path.join(postDir, "index.html");
    fs.writeFileSync(outputPath, html);
    console.log(`✅ Generated: ${outputPath}`);

    // Update cache for this post
    cache.posts[post.slug] = { sourceHash: post.sourceHash };
  });

  // Regenerate index and archive if any changes occurred
  if (hasChanges || forceRebuild) {
    // Generate index page
    const recentPosts = posts.slice(0, 5);
    const indexTemplatePath = path.join(TEMPLATES_DIR, "index.ejs");
    const indexTemplate = fs.readFileSync(indexTemplatePath, "utf-8");
    const indexHTML = ejs.render(
      indexTemplate,
      { recentPosts },
      { filename: indexTemplatePath }
    );
    fs.writeFileSync("index.html", indexHTML);
    console.log("✅ Generated: index.html");

    // Generate archive page - group posts by year
    const postsByYear = {};
    posts.forEach((post) => {
      const year = post.date.split("-")[0];
      if (!postsByYear[year]) {
        postsByYear[year] = [];
      }
      postsByYear[year].push(post);
    });

    const archiveTemplatePath = path.join(TEMPLATES_DIR, "archive.ejs");
    const archiveTemplate = fs.readFileSync(archiveTemplatePath, "utf-8");
    const archiveHTML = ejs.render(
      archiveTemplate,
      { postsByYear },
      { filename: archiveTemplatePath }
    );
    if (!fs.existsSync("archive")) {
      fs.mkdirSync("archive", { recursive: true });
    }
    fs.writeFileSync("archive/index.html", archiveHTML);
    console.log("✅ Generated: archive/index.html");

    // Generate RSS feed
    const feedTemplatePath = path.join(TEMPLATES_DIR, "feed.ejs");
    const feedTemplate = fs.readFileSync(feedTemplatePath, "utf-8");
    const feedXML = ejs.render(
      feedTemplate,
      { site: SITE_CONFIG, posts },
      { filename: feedTemplatePath }
    );
    fs.writeFileSync("feed.xml", feedXML);
    console.log("✅ Generated: feed.xml");

    // Generate sitemap
    const sitemapTemplatePath = path.join(TEMPLATES_DIR, "sitemap.ejs");
    const sitemapTemplate = fs.readFileSync(sitemapTemplatePath, "utf-8");
    const sitemapXML = ejs.render(
      sitemapTemplate,
      { site: SITE_CONFIG, posts },
      { filename: sitemapTemplatePath }
    );
    fs.writeFileSync("sitemap.xml", sitemapXML);
    console.log("✅ Generated: sitemap.xml");
  }

  // Save updated cache
  saveCache(cache);

  const duration = Date.now() - startTime;
  console.log(`\n🎉 Build complete in ${duration}ms!`);
  if (postsToRebuild.length < posts.length) {
    console.log(
      `   📊 Incremental: ${postsToRebuild.length}/${posts.length} post(s) rebuilt.`
    );
  } else {
    console.log(`   📊 Full build: ${posts.length} post(s) generated.`);
  }
  console.log("📐 KaTeX math rendering enabled.");
}

// Check for --force flag
const forceRebuild = process.argv.includes("--force");

// Watch mode
if (process.argv.includes("--watch")) {
  const chokidar = require("chokidar");

  console.log("👀 Watching for changes in posts-md/...\n");
  build(forceRebuild);

  chokidar
    .watch(POSTS_MD_DIR, { ignoreInitial: true })
    .on("all", (event, filePath) => {
      console.log(`\n📝 ${event}: ${filePath}`);
      build(false); // Incremental build on file change
    });
} else {
  build(forceRebuild);
}

// Export functions for testing
module.exports = { computeHash, formatDate, renderKaTeX };
