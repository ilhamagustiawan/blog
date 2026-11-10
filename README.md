# blog

Personal site: writing, photos, drawings. Built on
[astro-navfolio](https://github.com/dodolalorc/astro-navfolio) (MIT), styled after
[stevedylan.dev](https://stevedylan.dev/) and [macwright.com](https://macwright.com/).

## Develop

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # static site in dist/
```

## Content

| What     | Where                               |
| -------- | ----------------------------------- |
| Posts    | `src/content/blog/*.md`             |
| Photos   | `src/content/gallery/photos/*.md`   |
| Drawings | `src/content/gallery/drawings/*.md` |
| About    | `src/content/about.md`              |
| Settings | `src/config/site.toml`              |

New post: `bun run post:new my-post`.

Gallery item: drop the image next to a Markdown file:

```md
---
title: Harbor at dusk
date: 2026-11-08
kind: photo # or drawing
image: ./2026-11-08-harbor-dusk.jpg
---
```

Home shows the latest 10 posts and latest 5 photos and drawings.

## Theme

Palette `ink` in `src/styles/global.css`: light from macwright.com, dark from
stevedylan.dev. Fonts: Commit Mono (UI), Source Serif 4 (prose).
