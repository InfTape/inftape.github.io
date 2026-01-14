---
title: "Blog Content Publisher Skill"
date: "2026-01-14"
description: "An English write-up of the blog-content-publisher skill.md definition and workflow from a Chinese draft."
tags: ["workflow", "skills", "publishing", "automation"]
---

This time I used a skill called `blog-content-publisher` to 'publish posts'. The goal is straightforward: translate the Chinese content I finish in the `drafts/` folder into English, format it, place it in `posts-md/`, trigger a build, generate the final static pages, open a local web server for preview, and then push to GitHub.

For me, the biggest benefits are stability and convenience. I only need to hand over the content and the skill fills in `title`/`date`/`description`/`tags`, translates, formats the Markdown file, and runs `npm run build` to output `posts/<slug>/index.html`.

I like this structured workflow. Below is the `SKILL.md` I wrote.

```markdown
---
name: blog-content-publisher
description: Translate Chinese blog drafts to English. When users write a Simplified Chinese draft in `drafts/*.md` (filename not fixed), translate it to English, rename it by theme, move it to `posts-md/`, format in Markdown, then build and start a local server on port `8000` if it is not already running.
---

## Blog Content Publisher

### Overview

Translate the latest Chinese draft in `drafts/` into English, generate compliant front matter and body content, rename the file, move it into `posts-md/`, run the build, and start a local web server.

### Workflow

1. Find the most recently modified Chinese `.md` draft in `drafts/` (filename not fixed). If multiple candidates exist, only process the latest and mention that in the output.
2. Parse the Chinese draft and generate English content:
   - Keep only the English body; do not retain the Chinese body.
   - Auto-generate front matter: `title`/`date`/`description`/`tags`.
3. Generate a slug from the English theme (lowercase + hyphens), then rename and move to `posts-md/<slug>.md`.
4. Normalize formatting:
   - Use `#`/`##` for headings.
   - Format lists and code blocks per Markdown conventions.
   - Prefer backticks for commands, paths, or placeholders to improve readability.
5. Run `npm run build`.
6. If local port `8000` is not listening, start `python -m http.server 8000` in the background; if it is running, do not start it again.

### Constraints

- Input: a Chinese `.md` draft under `drafts/`.
- Output: English-only `.md`, moved into `posts-md/`.
- File naming: English theme → slug (lowercase + hyphens).

### Example

Input: `drafts/我的新随笔.md` (Chinese content)
Output:

- `posts-md/my-new-essay.md` (English content)
```

Overall, this skill bridges the gap between writing and publishing. I can focus on writing in Chinese without worrying about translation, formatting, or building, and the experience feels smooth and reliable.
