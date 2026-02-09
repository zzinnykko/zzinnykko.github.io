import { h } from "preact";
import { render } from "preact-render-to-string";

export type PageProps = { title: string, updated: string, content: string, href: string };
export function renderPage(props: PageProps): string {
    props.title ??= "#n/a";
    props.updated ??= new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    props.content ??= "#n/a";
    props.href ??= "#n/a";

    const Component = (
        <article class="page">
            <h1 id="page-title">{ props.title }</h1>
            <div class="text-right">Last updated: { props.updated }</div>
            <div class="markdown-body" dangerouslySetInnerHTML={{ __html: props.content }}></div>
        </article>
    );

    return render(Component);
}

export type DirProps = { title: string, updated: string, pages: PageProps[] };
export function renderDir(props: DirProps): string {
    props.title ??= "#n/a";
    props.updated ??= new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    props.pages ??= [{ title: "#n/a", updated: "#n/a", content: "#n/a", href: "#n/a" }];

    const Component = (
        <article class="dir">
            <h1 id="page-title">{ props.title }</h1>
            <div class="text-right">Last updated: { props.updated }</div>
            <div class="postlist-body">
                { props.pages.map((page) => (
                    <li><a href={ page.href }>{ page.title }</a><span>, Last updated: { page.updated }</span></li>
                )) }
            </div>
        </article>
    );

    return render(Component);
}