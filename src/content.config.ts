import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const page = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./markdown/page" }),
});
const dir = defineCollection({
    loader: glob({ pattern: "*.md", base: "./markdown/dir" }),
});

export const collections = { page, dir };
