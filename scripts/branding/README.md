# Site icons

`favicon.svg` here is the master: a "/" mark with a dot, in the site's
dark palette. Every favicon, app icon, and `public/images/avatar.webp` is
exported from it.

Regenerate from the repository root after editing the master:

```sh
bun scripts/branding/generate.mjs
bun scripts/branding/verify-ico.mjs
```
