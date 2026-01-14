---
title: "Blog Content Publisher Workflow"
date: "2026-01-14"
description: "A structured workflow for translating Chinese drafts into English posts, formatting them, and building a static site."
tags: ["workflow", "automation", "publishing", "blogging"]
---

This time I used a skill called `blog-content-publisher` to "publish posts." The goal is straightforward: translate the Chinese content I finish in the `drafts/` folder into English, format it, place it in `posts-md/`, trigger a build, generate the final static pages, open a local web server for preview, and then push to GitHub.

For me, the biggest benefits are stability and convenience. I only need to hand over the content and the skill fills in `title`/`date`/`description`/`tags`, generates a Markdown file, and runs `npm run build` to output `posts/<slug>/index.html`.

## Workflow Summary

- Write a Chinese `.md` draft in `drafts/` (filename can be anything).
- Find the most recently modified draft, translate it into English, and generate `title`/`date`/`description`/`tags`.
- Generate a slug from the English theme, then move and rename to `posts-md/<slug>.md`.
- Reformat the English content to follow Markdown conventions.
- Run `npm run build`.
- If port `8000` is not running locally, start `python -m http.server 8000` in the background; if it is running, do not start it again.

Overall, this skill bridges the gap between writing and publishing. I can focus on writing in Chinese without worrying about translation, formatting, or building, and the experience feels smooth and reliable.
