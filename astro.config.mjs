// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// `site` drives canonical URLs and (later) the sitemap — must be the canonical
// production domain. teatown.es redirects here, so .at is canonical.
export default defineConfig({
  site: "https://teatown.at",
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
