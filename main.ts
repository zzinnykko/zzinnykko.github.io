import markdownit from "markdown-it";
import hljs from "highlight.js";
import fg from "fast-glob";
import * as path from "@std/path";
import fs from "fs-extra";
import matter from "gray-matter";
import { renderPage, PageProps, renderDir, DirProps } from "./layouts/components.tsx";
import { renderLayout, LayoutProps } from "./layouts/layouts.tsx";

/**
 * 초기화
 */
const md = markdownit({
    html: false,
    xhtmlOut: true,
    highlight: (str, lang, _attrs) => {
        const language = hljs.getLanguage(lang)?.name ?? "plaintext";

        return `<pre><code class="hljs language-${ language }">`
                + hljs.highlight(str, { language }).value
                + `</code></pre>`;
    },
});
const dirpages = {} as {
    [pdir: string]: PageProps[],
};
fs.remove("./_site");


/**
 * md 파싱 후 저장
 */
const allglobs = [
    ...(await fg.glob("./page/**/*.md")).sort(),
    ...(await fg.glob("./dir/*.md")).sort(),
];
for (const src of allglobs) {
    const p = path.parse(src as string);
    const pdir = p.dir;
    const slug = p.name.replace(/\[.*?\]/g, "").trim().replace(/\s+/g, "_");
    let href = ((pdir === "./dir") ? "/dir/" : "/page/") + slug;
    const tar = "./_site" + href + ".json";
    if (href === "/page/index") href = "/";
    
    const { title, updated, content } = await (async () => {
        const m = matter(await fs.readFile(src, { encoding: "utf-8" }));
        const title = m.data.title || "no title";
        const updated = m.data.updated || new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
        const content = (pdir === "./dir")
            ? renderDir({ title, updated, pages: dirpages[`./page/${ slug }`] })
            : renderPage({ title, updated, content: m.content, href }); 

        return { title, updated, content };
    })();

    dirpages[pdir] ??= [];
    dirpages[pdir].push({ title, updated, content: "", href });

    fs.outputJSON(tar, { title, updated, content });
}


/**
 * index.html, 404.html 만들기
 */
{
    const html = renderLayout({ dirs: [] });
    await fs.writeFile("./_site/index.html", html, { encoding: "utf-8" });
}