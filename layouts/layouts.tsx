import { h } from "preact";
import { render } from "preact-render-to-string";
import { PageProps } from "./components.tsx";


/**
 * Layout 컴포넌트
 */
export type LayoutProps = { dirs: PageProps[] };
const Layout = (props: LayoutProps): h.JSX.Element => {
    return (
        <html lang="ko">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                <title>zzinnykko's blog</title>
                <link rel="stylesheet" href="/global.css" />
            </head>
            <body class="fixed top-0 right-0 bottom-0 left-0 overflow-y-auto">
                <div class="wrapper sticky top-0">Header</div>
                <div class="wrapper">Nav</div>
                <div class="wrapper">Main</div>
                <div class="wrapper sticky top-[100vh]">Footer</div>
            </body>
        </html>
    );
};
export const renderLayout = (props: LayoutProps) => "<!doctype html>" + render(<Layout { ...props } />);


/**
 * Header 컴포넌트
 */
export const Header = (): h.JSX.Element => {
    return (
        <header class="py-4 px-1 flex justify-between items-center">
            <div>
                <h1 id="site-title">zzinnykko's blog</h1>
            </div>
            <div>
                <button id="to-top" type="button">to top</button>
            </div>
            <div class="hidden" dangerouslySetInnerHTML={{ __html: `
                <script type="module">
                    const $toTop = document.getElementById("to-top");

                    $toTop.addEventListener("click", (e) => {
                        window.dispatchEvent(new CustomEvent("click-to-top"));
                    });
                </script>
            ` }} />
        </header>
    );
};