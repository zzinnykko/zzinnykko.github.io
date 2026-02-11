import { html, raw } from "@hono/hono/html";
import type { FC } from "@hono/hono/jsx"
import { PageProps } from "./components.tsx";


/**
 * Layout 컴포넌트
 */
export type LayoutProps = { dirs: PageProps[] };
const Layout: FC<LayoutProps> = (props) => {

    const code = /* javascript */ `
        const $container = document.getElementById("container");

        window.addEventListener("click-to-top", () => {
            $container.scrollTo({ top: 0, behavior: "smooth" });
        });                    

        async function fetchContent() {
            const reqPathname = window.location.pathname;
            const tar = ((reqPathname === "/") ? "/page/index" : reqPathname) + ".json";

            window.dispatchEvent(new CustomEvent("fetch-content", { detail: { tar } }));
        }

        // 주소 직접 입력
        await fetchContent();

        // 브라우저 전/후 이동 버튼 클릭
        window.onpopstate = async () => {
            await fetchContent();
        };

        // a 태그 클릭
        document.body.addEventListener("click", async (e) => {
            const el = e.target;

            // 클릭 태그가 <a> 아니거나, href 도메인이 블로그가 아니거나, 해시태그나 파일(. 으로 판별)이거나, href 가 현재의 주소와 동일하면 리턴
            if (!el.matches("a")) return;
            if (!el.href.startsWith(window.location.origin)) return;
            if (el.href.match(/[#.]/)) return;
            if (el.href === window.location.href) return;

            e.preventDefault();
            history.pushState(null, "", el.href);
            await fetchContent();
        });
    `;

    return (
        <html lang="ko">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                <title>zzinnykko's blog</title>
                <link rel="stylesheet" href="/global.css" />
            </head>
            <body>
                <div id="container" class="fixed top-0 right-0 bottom-0 left-0 overflow-y-scroll">
                    <div class="wrapper sticky top-0"><Header /></div>
                    <div class="wrapper"><Nav { ...props } /></div>
                    <div class="wrapper"><Main /></div>
                    <div class="wrapper sticky top-[100vh]"><Footer /></div>
                    <script type="module" dangerouslySetInnerHTML={{ __html: code }} />
                </div>
            </body>
        </html>
    );
};
export const renderLayout = (props: LayoutProps) => "<!doctype html>" + raw(<Layout { ...props } />).toString();


/**
 * Header 컴포넌트
 */
const Header: FC = () => {

    const code = /* javascript */ `
        const $toTop = document.getElementById("to-top");

        $toTop.addEventListener("click", (e) => {
            window.dispatchEvent(new CustomEvent("click-to-top"));
        });
    `;

    return (
        <header class="py-4 px-1 flex justify-between items-center">
            <div>
                <h1 id="site-title">zzinnykko's blog</h1>
            </div>
            <div>
                <button id="to-top" type="button">to top</button>
            </div>
            <script type="module" dangerouslySetInnerHTML={{ __html: code }} />
        </header>
    );
};


/**
 * Nav 컴포넌트
 */
const Nav: FC<LayoutProps> = (props) => {
    // console.log(props);

    return (
        <nav class="py-4 px-1">
            <ul class="flex justify-start items-center gap-x-4">
                <li>카테고리:</li>
                { 
                    props.dirs.map((dir) => (
                        <li><a href={ dir.href }>{ dir.title }</a></li>
                    ))
                }
            </ul>
        </nav>
    );
};


/**
 * Main 컴포넌트
 */
const Main: FC = () => {

    const code = /* javascript */ `
        const $attachJsonHere = document.getElementById("attach-json-here");
        
        window.addEventListener("fetch-content", async (e) => {
            let tar = e.detail.tar;

            console.log(tar);

            let res = await fetch(tar);
            let content = {};

            if (res.status !== 200) {
                tar = "/page/404.json";
                res = fetch(tar);
            }

            try {
                content = await res.json();
            } catch (err) {
                content = { content: tar + " is not a valid json file" };
            }

            $attachJsonHere.innerHTML = content.content;
        });
    `;

    return (
        <main id="attach-json-here" class="py-4 px-1">
            <script type="module" dangerouslySetInnerHTML={{ __html: code }} />
        </main>
    );
};


/**
 * Footer 컴포넌트
 */
const Footer: FC = () => {
    return (
        <footer class="py-4 px-1 flex justify-center items-center flex-nowrap">
            <div>this blog is designed by zzinnykko,</div>
            <div>built with deno,</div>
            <div>and powered by github pages</div>
        </footer>
    );
}; 