/**
 * main 브랜치의 page 폴더와 dir 폴더의 마크다운 파일들을 파싱
 * markdown-it, highlight.js, liquidjs 사용하여 최종적으로 html 생성
 * gh-pages 브랜치의 _page 폴더와 _dir 폴더에 동일한 하위 폴더로 저장
 * 
 * page 폴더를 먼저 파싱, dir 폴더 파싱에 필요한 정보, 라우팅과 html 파일 매칭 정보 담은 filesinfo.json 생성
 * fileinfo.json ==> [ { route: { file, dir, title, updated }}]
 */

// @deno-types="npm:@types/markdown-it"
import markdownit from "npm:markdown-it@14.1.0";
import hljs from "npm:highlight.js@11.11.1";
import { Liquid } from "npm:liquidjs@10.24.0";
import matter from "npm:gray-matter@4.0.3";
import { expandGlob } from "jsr:@std/fs@1.0.22";
import { relative, parse } from "jsr:@std/path@1.1.4";
import { error } from "node:console";


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
 * 메인 실행 코드
 */
const startTime = performance.now();

const filesinfo: { [route: string]: { file: string, dir: string, title: string, updated: string } }[] = [];
await parsePage();
await parseDir();

const ds = Math.floor((performance.now() - startTime) / 1_000);
console.log(`수행 시간 ==> ${ Math.floor(ds / 60) }분 ${ Math.floor(ds % 60) }초`);
Deno.exit(0);




/**
 * page 마크다운 소스를 html 타겟으로 변환하는 함수
 */
async function parsePage() {
    
    // _page 폴더 삭제
    try {
        await Deno.remove("./_page", { recursive: true });
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) throw err;
    }

    // 마크다운 읽어서 변환
    const pages = expandGlob("./page/**/*.md");
    for await (const f of pages) {
        const f_rel = relative(Deno.cwd(), f.path);
        const { file, dir, title, updated } = await conv(f_rel, { content: "" });

        let route = f_rel.slice(1, -3).replace(/\[.*\]/, "");
        if (route === "/page/index") route = "/";
        filesinfo.push({ [route]: { file, dir, title, updated } });
    }
}


/**
 * dir 마크다운 소스를 html 타겟으로 변환하는 함수
 */
async function parseDir() {

    // _dir 폴더 삭제
    try {
        await Deno.remove("./_dir", { recursive: true });
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) throw err;
    }

    // 마크다운 읽어서 변환
    const dirs = expandGlob("./dir/**/*.md");
    for await (const f of dirs) {
        const f_rel = relative(Deno.cwd(), f.path);
        const { file, dir, title, updated } = await conv(f_rel, { content: "", filesinfo });

        let route = f_rel.slice(1, -3).replace(/\[.*\]/, "");
        // if (route === "/page/index") route = "/";
        filesinfo.push({ [route]: { file, dir, title, updated } });
    }

    // 블로그 외형에서 사용할 nav.html 생성
    

    // filesinfo.json 저장
    await Deno.writeTextFile("./filesinfo.json", JSON.stringify(filesinfo));
}




/**
 * 마크다운 -> html 변환하여 저장 함수
 */
async function conv(markdownFile: string, vars: { content: string, [key: string]: any }): Promise<{ file: string, dir: string, title: string, updated: string }> {
    
    // 마크다운 파싱
    let { data, content } = matter(await Deno.readTextFile(markdownFile));
    content = md.render(content);
    Object.assign(vars, { ...data, content });

    // layout 속성에 따라 연쇄 liquidjs 파싱
    while ("layout" in vars) {
        let { data, content } = matter(await Deno.readTextFile(`./_layout/${vars.layout}.liquid`));
        delete vars.layout;
    
        Object.assign(vars, { ...data } );
        content = await engine.parseAndRender(content, vars);
        Object.assign(vars, { content });
    }

    // 파일 쓰기
    const tarFile = "./_" + markdownFile.slice(2, -3) + ".html";
    await Deno.writeTextFile(tarFile, vars.content);

    // 리턴
    return { file: tarFile, dir: tarFile.split("/")[2] ?? "/", title: vars.title, updated: vars.updated };
}


