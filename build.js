const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');
const katex = require('katex');

// Configuration
const POSTS_DIR = './posts';
const POSTS_MD_DIR = './posts-md';
const OUTPUT_DIR = './posts';

// Ensure directories exist
if (!fs.existsSync(POSTS_MD_DIR)) {
    fs.mkdirSync(POSTS_MD_DIR, { recursive: true });
}

// KaTeX rendering function
function renderKaTeX(content) {
    // Render display math: $$...$$
    content = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
        try {
            return katex.renderToString(math.trim(), {
                displayMode: true,
                throwOnError: false
            });
        } catch (e) {
            console.warn('KaTeX error:', e.message);
            return match;
        }
    });

    // Render inline math: $...$  (but not $$)
    content = content.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
        try {
            return katex.renderToString(math.trim(), {
                displayMode: false,
                throwOnError: false
            });
        } catch (e) {
            console.warn('KaTeX error:', e.message);
            return match;
        }
    });

    return content;
}

// Configure marked for better code highlighting
marked.setOptions({
    gfm: true,
    breaks: true
});

// Helper function to format date
function formatDate(date) {
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
        return date;
    }
    return new Date().toISOString().split('T')[0];
}

// Get KaTeX CSS path (use CDN for simplicity)
const KATEX_CSS = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';

// Post template
function generatePostHTML(post) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${post.description || post.title}">
    <title>${post.title} - samzhang</title>
    <link rel="stylesheet" href="../../style.css">
    <link rel="stylesheet" href="${KATEX_CSS}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Inter:wght@400;500&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../post.css">
</head>
<body>
    <main class="container">
        <nav class="breadcrumb">
            <a href="../../">← Back to home</a>
        </nav>

        <article class="post">
            <header class="post-header">
                <h1 class="post-title">${post.title}</h1>
                <time class="post-meta">${post.date}</time>
            </header>

            <div class="post-content">
                ${post.content}
            </div>
        </article>

        <footer class="site-footer">
            <p>&copy; 2026 samzhang. All rights reserved.</p>
        </footer>
    </main>
    <script src="../../theme.js"></script>
</body>
</html>`;
}

// Generate index page with posts
function generateIndexHTML(posts) {
    const recentPosts = posts.slice(0, 5);
    const postListHTML = recentPosts.map(post => `
                <li class="post-item">
                    <a href="posts/${post.slug}/" class="post-link">${post.title}</a>
                    <time class="post-date">${post.date}</time>
                </li>`).join('');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Sam的个人博客 - 记录生活与技术的点滴">
    <title>samzhang</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
    <main class="container">
        <header class="site-header">
            <div class="header-top">
                <h1 class="site-title">samzhang</h1>
                <nav class="site-nav">
                    <a href="about/">About</a>
                    <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
                        <span class="icon-sun">☀️</span>
                        <span class="icon-moon">🌙</span>
                    </button>
                </nav>
            </div>
            <p class="site-tagline">a journey of code and life</p>
        </header>

        <section class="section">
            <h2 class="section-title">Recent posts</h2>
            <ul class="post-list">${postListHTML}
            </ul>
            <a href="archive/" class="more-link">More···</a>
        </section>

        <section class="section">
            <h2 class="section-title">Projects</h2>
            <ul class="project-list">
                <li class="project-item">
                    <a href="https://github.com/sam/awesome-tool" class="project-name">awesome-tool</a>: 
                    <span class="project-desc">A collection of useful command-line utilities</span>
                </li>
                <li class="project-item">
                    <a href="https://github.com/sam/mini-framework" class="project-name">mini-framework</a>: 
                    <span class="project-desc">Lightweight JavaScript framework for building web apps</span>
                </li>
                <li class="project-item">
                    <a href="https://github.com/sam/dotfiles" class="project-name">dotfiles</a>: 
                    <span class="project-desc">Personal configuration files for development environment</span>
                </li>
            </ul>
        </section>

        <section class="section">
            <h2 class="section-title">Links</h2>
            <ul class="link-list">
                <li class="link-item">
                    GitHub: <a href="https://github.com/samzhang">@samzhang</a>
                </li>
                <li class="link-item">
                    Twitter: <a href="https://twitter.com/samzhang">@samzhang</a>
                </li>
                <li class="link-item">
                    Email: <a href="mailto:sam@example.com">sam@example.com</a>
                </li>
            </ul>
        </section>

        <footer class="site-footer">
            <p>&copy; 2026 samzhang. All rights reserved.</p>
        </footer>
    </main>
    <script src="theme.js"></script>
</body>
</html>
`;
}

// Generate archive page
function generateArchiveHTML(posts) {
    // Group posts by year
    const postsByYear = {};
    posts.forEach(post => {
        const year = post.date.split('-')[0];
        if (!postsByYear[year]) {
            postsByYear[year] = [];
        }
        postsByYear[year].push(post);
    });

    const years = Object.keys(postsByYear).sort((a, b) => b - a);
    
    const sectionsHTML = years.map(year => {
        const postsHTML = postsByYear[year].map(post => `
                <li class="post-item">
                    <a href="posts/${post.slug}/" class="post-link">${post.title}</a>
                    <time class="post-date">${post.date}</time>
                </li>`).join('');
        
        return `
        <section class="archive-section" style="margin-top: 2rem;">
            <h2 class="section-title">${year}</h2>
            <ul class="post-list">${postsHTML}
            </ul>
        </section>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="文章归档 - samzhang的博客">
    <title>Archive - samzhang</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
    <main class="container">
        <nav class="breadcrumb" style="margin-bottom: 2rem;">
            <a href="../" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9rem;">← Back to home</a>
        </nav>

        <header class="page-header" style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border);">
            <h1 style="font-family: 'Noto Serif SC', Georgia, serif; font-size: 2rem; font-weight: 400;">Archive</h1>
        </header>
${sectionsHTML}

        <footer class="site-footer">
            <p>&copy; 2026 samzhang. All rights reserved.</p>
        </footer>
    </main>
    <script src="../theme.js"></script>
</body>
</html>
`;
}

// Read all markdown files and parse them
function readMarkdownPosts() {
    const posts = [];
    
    if (!fs.existsSync(POSTS_MD_DIR)) {
        console.log(`Creating ${POSTS_MD_DIR} directory...`);
        fs.mkdirSync(POSTS_MD_DIR, { recursive: true });
        return posts;
    }

    const files = fs.readdirSync(POSTS_MD_DIR).filter(f => f.endsWith('.md'));
    
    files.forEach(file => {
        const filePath = path.join(POSTS_MD_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { attributes, body } = frontMatter(content);
        
        const slug = file.replace('.md', '');
        
        // First render KaTeX, then markdown
        const katexProcessed = renderKaTeX(body);
        const htmlContent = marked(katexProcessed);
        
        posts.push({
            slug,
            title: attributes.title || slug,
            date: formatDate(attributes.date),
            description: attributes.description || '',
            tags: attributes.tags || [],
            content: htmlContent
        });
    });

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return posts;
}

// Build all posts
function build() {
    console.log('🚀 Building blog...\n');
    
    const posts = readMarkdownPosts();
    
    if (posts.length === 0) {
        console.log('⚠️  No markdown posts found in posts-md/ directory.');
        console.log('   Create a .md file with front matter like:\n');
        console.log('   ---');
        console.log('   title: My First Post');
        console.log('   date: 2026-01-11');
        console.log('   description: A brief description');
        console.log('   ---');
        console.log('   Your markdown content here...');
        console.log('');
        console.log('   Math support: Use $inline$ or $$display$$ for KaTeX\n');
        return;
    }

    // Ensure posts directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate individual post pages
    posts.forEach(post => {
        const html = generatePostHTML(post);
        const postDir = path.join(OUTPUT_DIR, post.slug);
        if (!fs.existsSync(postDir)) {
            fs.mkdirSync(postDir, { recursive: true });
        }
        const outputPath = path.join(postDir, 'index.html');
        fs.writeFileSync(outputPath, html);
        console.log(`✅ Generated: ${outputPath}`);
    });

    // Generate index page
    const indexHTML = generateIndexHTML(posts);
    fs.writeFileSync('index.html', indexHTML);
    console.log('✅ Generated: index.html');

    // Generate archive page
    const archiveHTML = generateArchiveHTML(posts);
    if (!fs.existsSync('archive')) {
        fs.mkdirSync('archive', { recursive: true });
    }
    fs.writeFileSync('archive/index.html', archiveHTML);
    console.log('✅ Generated: archive/index.html');

    console.log(`\n🎉 Build complete! ${posts.length} post(s) generated.`);
    console.log('📐 KaTeX math rendering enabled.');
}

// Watch mode
if (process.argv.includes('--watch')) {
    const chokidar = require('chokidar');
    
    console.log('👀 Watching for changes in posts-md/...\n');
    build();
    
    chokidar.watch(POSTS_MD_DIR, { ignoreInitial: true }).on('all', (event, path) => {
        console.log(`\n📝 ${event}: ${path}`);
        build();
    });
} else {
    build();
}
