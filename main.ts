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

    // console.log(src, "==>", dir);

    const { data, content } = matter(await fs.readFile(src, { encoding: "utf-8" }));
    const parsed = md.render(content);
    const vars = {
        ...data,
        content: parsed,
        pages: (dir === "_dir") ? dirpages[slug] ?? [{ title: "#n/a", url: "#n/a", updated: "#n/a" }] : [],     // _dir 폴더의 경우만 정상작동
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


/**
 * index.html, 404.html, sitemap.xml 작성
 */
{
    console.log(dirpages);

    let src = `${ root }/_layout/layout.pug`
    let parsed = pug.render(
        await fs.readFile(src, { encoding: "utf-8" }),
        { pages: dirpages["_dir"], filename: src },
    );
    await fs.outputFile(`${ root }/_site/index.html`, parsed, { encoding: "utf-8" });
    await fs.copyFile(`${ root }/_site/index.html`, `${ root }/_site/404.html`);

    src = `${ root }/_layout/sitemap.pug`;
    parsed = pug.render(
        await fs.readFile(src, { encoding: "utf-8" }),
        { dirpages: dirpages },
    ); 
    await fs.outputFile(`${ root }/_site/sitemap.xml`, parsed, { encoding: "utf-8" });
}