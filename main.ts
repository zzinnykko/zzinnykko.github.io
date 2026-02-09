// @deno-types="npm:@types/markdown-it@14.1";
import markdownit from "npm:markdown-it@14.1";
import hljs from "npm:highlight.js@11.11";
import fg from "npm:fast-glob@3.3";
import * as path from "jsr:@std/path@1.1";

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
    [pdir: string]: { pdir: string, href: string, title: string, updated: string, [key: string]: any }[],
};


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
}
