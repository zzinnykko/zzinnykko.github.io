import markdownit from "markdown-it";
import hljs from "highlight.js";
import { glob } from "node:fs/promises";
import fs from "fs-extra";
import path from "node:path";
import matter from "gray-matter";
import pug from "pug";


/**
 * 초기화
 */
const md = markdownit({
    html: false,
    xhtmlOut: true,
    highlight: (str, lang, _attrs) => {
        const language = hljs.getLanguage(lang)?.name ?? "plaintext";

        return `<pre><code class="hljs language-${ language }>${ hljs.highlight(str, { language }).value }</code></pre>`;
    },
});

const root = process.cwd();
await fs.remove(`${ root }/_site`);

const allglob = [
    ...(await Array.fromAsync(glob(`${ root }/_page/**/*.md`))).sort(),
    ...(await Array.fromAsync(glob(`${ root }/_dir/**.md`))).sort(),
];


/**
 * allglob 파싱, 저장
 */
const dirpages: Record<string, { title: string, url: string, updated: string }[]> = {};

for (const src of allglob) {
    const p = path.parse(src);
    const slug = p.name.replace(/\[.*?\]/g, "").trim().replace(/\s+/g, "_");
    const dir = p.dir.split(path.sep).at(-1);
    const prefix = (dir === "_dir") ? "/dir/" : "/page/";
    const url = (prefix === "/page/" && slug === "index") ? "/" : prefix + slug;
    const tar = root + "/_site" + prefix + slug + ".json";

    const { data, content } = matter(await fs.readFile(src, { encoding: "utf-8" }));
    const parsed = md.render(content);
    const vars = {
        ...data,
        content: parsed,
        pages: dirpages[dir] ?? [{ title: "#n/a", url: "#n/a", updated: "#n/a" }],
    } as { [key: string]: any };

    while ("layout" in vars) {
        const { data, content } = matter(await fs.readFile(`${ root }/_layout/${ vars.layout }.pug`, { encoding: "utf-8" }));
        delete vars.layout;
        Object.assign(vars, data);
        const parsed = pug.render(content, vars);
        Object.assign(vars, { content: parsed });
    }

    dirpages[dir] ??= [];
    dirpages[dir].push({ title: vars.title ?? "#n/a", url, updated: vars.url ?? "#n/a" });

    fs.outputJSON(tar, { src, tar, url, content: vars.content });
}