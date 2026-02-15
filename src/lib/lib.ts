import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import fs from "fs-extra";
import * as path from "path";

export type Pages = { title: string, updated: string, content: string, href: string, dir: string };
export type DirPages = { [dir: string]: Pages[] };
const dirpages: DirPages = {};

const container = await AstroContainer.create();

export const parsemd = async () => {
    await parsemd1();
    await parsemd2();
};

/////////////////
async function p(src: string, loader: () => Promise<unknown>) {
    const { frontmatter, Content } = await loader() as any;
    const title = frontmatter.title ?? "no title";
    const updated = frontmatter.updated ?? new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    const content = await container.renderToString(Content);
    
    const { dir, name } = path.parse(src);
    let href = ((dir === "/markdown/dir") ? "/dir/" : "/page/") + name.replace(/\[.*?\]/, "").trim().replace(/\s+/, "_");
    const tar = "./parsed" + href + ".json";
    if (href === "/page/index") href = "/";

    dirpages[dir] ??= [];
    dirpages[dir].push({ title, updated, href, content: "", dir });

    fs.outputJSON(tar, { title, updated, href, content, dir }, { encoding: "utf-8" });
}

async function parsemd2()  {
    const a = Object.entries(import.meta.glob("/markdown/dir/*.md")).sort((a, b) => a[0].localeCompare(b[0]));
    const globs = a;

    for (const [src, loader] of globs) {
        await p(src, loader);       
    }

    fs.outputJSON("./parsed/dirpages.json", dirpages, { encoding: "utf-8" });
}

async function parsemd1() {
    const a = Object.entries(import.meta.glob("/markdown/page/**/*.md")).sort((a, b) => a[0].localeCompare(b[0]));
    const globs = a;

    for (const [src, loader] of globs) {
        await p(src, loader);       
    }

    fs.outputJSON("./parsed/dirpages.json", dirpages, { encoding: "utf-8" });
}