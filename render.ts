import markdownit from "markdown-it";
import hljs from "highlight.js";
import fg from "fast-glob";
import fs from "fs-extra";
import matter from "gray-matter";


/**
 * 초기화
 */
const md = markdownit({
    html: false,
    xhtmlOut: true,
    highlight: (str, lang, _attrs) => {
        const language = hljs.getLanguage(lang)?.name ?? "plaintext";

        return `<pre><code class="hljs language-${ language }">${ hljs.highlight(str, { language }).value }</code></pre>`;
    },
});
await fs.remove("./_page");
await fs.remove("./_dev");


/**
 * page, dir 폴더 glob --> dir: { pages }[] 형태 파일 생성
 * dir 폴더의 dir 은 "_dir" 로 고정
 */
const dirpages = await (async () => {
    const result: { [dir: string]: string[] } = {};

    for (const path of (await fg.glob("./page/**/*.md")).sort()) {
        const dir = path.split("/").at(-2)!;
        
        result[dir] ??= [];
        result[dir].push(path);
    }

    for (const path of (await fg.glob("./dir/*.md")).sort()) {
        const dir = "_dir";

        result[dir] ??= [];
        result[dir].push(path);
    }

    return result;
})();


/**
 * dirpages 순회, md 파싱, json 생성, _nav.json 위한 nav 파일 생성
 */
const navinfo: { [key: string]: string }[] = [];
for (const [dir, pages] of Object.entries(dirpages)) {
    for (const src of pages) {
        const raw = await fs.readFile(src, { encoding: "utf-8" });
        const { data, content } = matter(raw);
        const parsed = md.render(content);

        const name = src.split("/")?.at(-1)?.replace(/\[.*?\]/g, "").replace(/\.md$/, "").trim().replace(/\s+/g, "_");
        const tar = (dir === "_dir") ? `./_dir/${ name }.json` : `./_page/${ name }.json`;
        if (dir === "_dir") {
            navinfo.push({ ...data, href: `/_dir/${ name }` });
        }

        await fs.outputJSON(tar, { ...data, content: parsed });
    }
}


/**
 * _nav.json 생성
 */
let nav = ``;
for (const x of navinfo) {
    nav += `<li><a href="${ x.href }">${ x.title }</a></li>`;
}
await fs.outputJSON("./_dir/_nav.json", { content: nav }, { encoding: "utf-8" });


/**
 * 마무리
 */
await fs.outputFile("./ping.txt", Date.now().toString(), { encoding: "utf-8" });
await fs.remove("./page");
await fs.remove("./dev");