// "/" 는 index, 404, "_dir" 은 _dir 폴더 내용
type DirPages = { [key: string]: { dir: string, href: string, path: string, resolver: () => Promise<unknown> }[] };

export const dirpages: DirPages = await (async () => {
    const result: DirPages = {};

    let glob = Object.entries(import.meta.glob("$/_page/**/*.md")).sort((a, b) => a[0].localeCompare(b[0]));
    for (const [path, resolver] of glob) {
        const t = path.split("/");
        const dir = (t.at(-2) === "_page" ? "/" : t.at(-2)) ?? "undefined";
        const href = "/page/" + t.at(-1)?.replace(/\.md$/g, "").replace(/\[.*?\]/g, "").trim().replace(/\s+/g, "_");
        
        result[dir] ??= [];
        result[dir].push({ dir, href, path, resolver });
    }

    glob = Object.entries(import.meta.glob("$/_dir/*.md")).sort((a, b) => a[0].localeCompare(b[0]));
    for (const [path, resolver] of glob) {
        const t = path.split("/");
        const dir = t.at(-1)?.replace(/\.md$/g, "").replace(/\[.*?\]/g, "").trim().replace(/\s+/g, "_") ?? "undefined";
        const href = "/dir/" + dir;

        result["_dir"] ??= [];
        result["_dir"].push({ dir, href, path, resolver });
    }

    return result;
})();

console.log(dirpages);