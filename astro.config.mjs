// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// NOTE: `site` drives canonical URLs and (later) sitemap. Confirm the production
// domain before launch — placeholder derived from the team email domain.
export default defineConfig({
  site: "https://teatown.es",
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
