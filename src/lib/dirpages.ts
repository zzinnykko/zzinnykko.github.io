export const allglob: { [dir: string]: { path: string, resolver: () => Promise<any> }[] } = await (async () => {
    
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


