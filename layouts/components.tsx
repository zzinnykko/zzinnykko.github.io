import { h } from "preact";
import { render } from "preact-render-to-string";

/**
 * Page 컴포넌트
 */
export type PageProps = { title: string, updated: string, content: string, href: string };
const Page = (props: PageProps): h.JSX.Element => {
    props.title ??= "#n/a";
    props.updated ??= new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    props.content ??= "#n/a";
    props.href ??= "#n/a";

    return (
        <article class="page">
            <h1 id="page-title">{ props.title }</h1>
            <div class="text-right">Last updated: { props.updated }</div>
            <div class="markdown-body" dangerouslySetInnerHTML={{ __html: props.content }}></div>
        </article>
    );
};
export const renderPage = (props: PageProps): string => render(<Page { ...props } />); 


/**
 * Dir 컴포넌트
 */
export type DirProps = { title: string, updated: string, pages: PageProps[] };
const Dir = (props: DirProps): h.JSX.Element => {
    props.title ??= "#n/a";
    props.updated ??= new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    props.pages ??= [{ title: "#n/a", updated: "#n/a", content: "#n/a", href: "#n/a" }];

    return (
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
};
export const renderDir = (props: DirProps): string => render(<Dir { ...props } />);


/**
 * Sitemap 컴포넌트
 */
export type SitemapProps = { [pdir: string]: PageProps[] };
const Sitemap = (props: SitemapProps): h.JSX.Element => {
    return (
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                
            </url>
        </urlset>
    );
};
export const renderSitemap = (props: SitemapProps): string => `<?xml version="1.0" encoding="UTF-8"?>` + render(<Sitemap { ...props } />);