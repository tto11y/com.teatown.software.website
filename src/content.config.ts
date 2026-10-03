import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Shared SEO fields. `description` is intentionally required everywhere —
// no page ships without a meta description.
const seo = {
  title: z.string(),
  description: z.string(),
  draft: z.boolean().default(false),
};

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    ...seo,
    heading: z.string().optional(), // H1 if it differs from `title`
    order: z.number().default(0),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/services" }),
  schema: z.object({
    ...seo,
    summary: z.string(), // card / listing blurb
    icon: z.string().optional(), // icon key (lucide/heroicons name)
    order: z.number().default(0),
    featured: z.boolean().default(false),
    show: z.boolean().default(true),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/case-studies" }),
  schema: ({ image }) =>
    z.object({
      ...seo,
      client: z.string(),
      industry: z.string().optional(),
      summary: z.string(),
      cover: image().optional(), // optimized via astro:assets
      date: z.coerce.date(),
      services: z.array(reference("services")).default([]), // typed cross-links
      results: z
        .array(z.object({ metric: z.string(), value: z.string() }))
        .default([]),
      featured: z.boolean().default(false),
    }),
});

export const collections = {
  pages,
  services,
  "case-studies": caseStudies,
};
