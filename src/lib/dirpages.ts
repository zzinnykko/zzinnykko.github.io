import type { MarkdownInstance } from "astro";

type Frontmatter = { title: string, updated: string, [key: string]: string };
type MdGlobResult = { path: string, url: string, slug: string, loader: () => Promise<MarkdownInstance<Frontmatter>> };

export const allglob: { [dir: string]: MdGlobResult[] } = await (async () => {
    const result = {} as { [dir: string]: MdGlobResult[] };
    
    const globs = Object.entries(
        import.meta.glob<MarkdownInstance<Frontmatter>>(
            ["$/_page/**/*.md", "$/_dir/*.md"]
        )
    ).sort((a, b) => a[0].localeCompare(b[0]));

    for (const [path, loader] of globs) {
        const dir = path.split("/").at(-2) ?? "";
        const slug = path.split("/").at(-1)?.replace(/\[.*?\]/g, "").replace(/\.md$/, "").trim().replace(/\s+/g, "_") ?? "#n/a";
        const url = (dir === "_dir" ? "/dir/" : "/page/") + slug;
        
        result[dir] ??= [];
        result[dir].push({ path, url, slug, loader });
    }

    return result;
})();

console.log(allglob);