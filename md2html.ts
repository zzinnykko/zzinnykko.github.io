/**
 * main 브랜치의 page 폴더와 dir 폴더의 마크다운 파일들을 파싱
 * markdown-it, highlight.js, liquidjs 사용하여 최종적으로 html 생성
 * gh-pages 브랜치의 동일한 위치에 저장
 * 
 * 라우팅과 html 파일 매칭하고 있는 fileinfo.json 생성
 * 
 * 파싱 전에 fileinfo.json 을 읽어와서, 파일명 [] 안에있는 버전정보가 변경된 마크다운만 파싱
 * main 브랜치에서 삭제한 파일은 gh-pagaes 브랜치의 동일한 위치의 파일을 삭제
 */

// @deno-types="npm:@types/markdown-it"
import markdownit from "npm:markdown-it@14.1.0";
import hljs from "npm:highlight.js@11.11.1";
import { Liquid } from "npm:liquidjs@10.24.0";
import matter from "npm:gray-matter@4.0.3";
import { expandGlob } from "jsr:@std/fs@1.0.22";


/**
 * 초기화
 */
const md = markdownit({
    html: false,
    xhtmlOut: true,
    highlight: (str, lang, _attrs) => {
        const language = hljs.getLanguage(lang)?.name ?? "plaintext";
        return `<pre><code class="hljs language-${language}"` + hljs.highlight(str, { language }).value + `</code></pre>`;
    },
});
const engine = new Liquid();


/**
 * 마크다운 -> html 변환 함수
 */
async function conv(markdownFile: string, vars: object) {
    let parsed = ``;

    // 마크다운 파싱
    let { data, content } = matter(await Deno.readTextFile(markdownFile));
    content = md.render(content);
    Object.assign(vars, { ...data, content });

    // layout 속성에 따라 연쇄 liquidjs 파싱
    while ("layout" in vars) {
        let { data, content } = matter(await Deno.readTextFile(`./_layout/${vars.layout}.liquid`));
        delete vars.layout;
        Object.assign(vars,)
    }


    
    content = await engine.parseAndRender(content, vars);
    

    // layout 에 따른 연쇄 liquidjs 파싱

}


md.render("code...");
engine.parseAndRender("...", {});