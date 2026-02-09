import { h } from "preact";
import { render } from "preact-render-to-string";
import { PageProps } from "./components.tsx";

type LayoutProps = { dirs: PageProps[] };
export function renderLayout(props: LayoutProps): string {
    const Component = (
        <html lang="ko">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                <title>zzinnykko's blog</title>
                <link rel="stylesheet" href="/global.css" />
                {/* <script src="https://cdn.tailwindcss.com"></script> */}
            </head>
            <body class="fixed top-0 right-0 bottom-0 left-0 overflow-y-auto">
                <div class="wrapper sticky top-0">Header</div>
                <div class="wrapper">Nav</div>
                <div class="wrapper">Main</div>
                <div class="wrapper sticky top-[100vh]">Footer</div>
            </body>
        </html>
    );

    return "<!doctype html>\n" + render(Component);
}


export function Header() {
    return (
        <header class="py-4 px-1 flex justify-between items-center">
            <div>
                <h1 id="site-title">zzinnykko's blog</h1>
            </div>
            <div>
                <button type="button">to top</button>
            </div>
        </header>
    );
}