import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// Schema-less so the agent can drop in freeform .md / .mdx with any (or no)
// frontmatter and have it render immediately.
const panes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/panes" }),
});

export const collections = { panes };
