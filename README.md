# Teatown website

Static marketing site for Teatown, built with [Astro](https://astro.build).
Content lives in typed Content Collections (Markdown/MDX) — no CMS. GitHub is the
single source of truth for code and copy.

## Stack

- **Astro** (static output), **Tailwind CSS v4** (via `@tailwindcss/vite`), **MDX**
- **Node 24** (see `.nvmrc`)

## Develop

```bash
nvm use            # Node 24
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # -> dist/
npm run preview    # serve the built site locally
npm run check      # astro check (types + content schema)
```

## Content

Edit Markdown in `src/content/`. Schemas are defined in `src/content.config.ts`.

- `pages/` — `home`, `about`, `contact` (single files)
- `services/` — one file per service (`order`, `featured` control placement)
- `case-studies/` — one file per engagement (`services` cross-links by id, `results` render as metric tiles)

Set `draft: true` to keep an entry out of the build. Add a `cover` image to a case
study (relative path in frontmatter) to get an optimized hero via `astro:assets`.

## To confirm before launch

- `site` in `astro.config.mjs` (currently `https://teatown.es`) — canonical URLs.
- Contact email in `src/pages/contact.astro`.
- Deploy pipeline (GitHub Action → Hetzner) — not yet scaffolded.
