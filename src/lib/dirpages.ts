import type { MarkdownInstance } from "astro";

type Frontmatter = { title: string, updated: string, [key: string]: string };
type MdGlobResult = { path: string, url: string, slug: string, loader: () => Promise<MarkdownInstance<Frontmatter>> };

export const allglob: { [dir: string]: MdGlobResult[] } = await (async () => {
    const result = {} as { [dir: string]: MdGlobResult[] };
    
    const globs = Object.entries(
        import.meta.glob<MarkdownInstance<Frontmatter>>(
            ["$src/_page/**/*.md", "$src/_dir/*.md"]
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



// type Frontmatter = { title: string, updated: string, [key: string]: any };

// export const dirpages = await (async (): Promise<Record<string, Frontmatter[]>> => {
//     const result: Record<string, Frontmatter[]> = {};
    
//     const pageGlobArray = Object.entries(import.meta.glob("$/page/**/*.md", { eager: true, import: "frontmatter" })).sort((a, b) => a[0].localeCompare(b[0])) as [string, Frontmatter][];
//     for (const [path, frontmatter ] of pageGlobArray) {
//         const dir = path.replace(/^\/page/, "").split("/").at(-2) || "/";
//         let url = `/_page/` + path.split("/").at(-1)?.replace(/\[.*?\]/g, "").replace(/\.md$/, "").trim().replace(/\s+/g, "_");
//         if (url === "/_page/index") url = "/";
        
//         result[dir] ??= [];
//         result[dir].push({ path, url, ...frontmatter });
//     }

//     const dirGlobArray = Object.entries(import.meta.glob("$/dir/*.md", { eager: true, import: "frontmatter" })).sort((a, b) => a[0].localeCompare(b[0])) as [string, Frontmatter][];
//     for (const [path, frontmatter] of dirGlobArray) {
//         const dir = "_dir";
//         const url = `/_dir/` + path.split("/").at(-1)?.replace(/\[.*?\]/g, "").replace(/\.md$/, "").trim().replace(/\s+/g, "_");

//         result[dir] ??= [];
//         result[dir].push({ path, url, ...frontmatter });
//     }

//     return result;
// })();


