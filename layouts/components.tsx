import { html, raw } from "@hono/hono/html";
import type { FC } from "@hono/hono/jsx"

/**
 * Page 컴포넌트
 */
export type PageProps = { title: string, updated: string, content: string, href: string };
const Page: FC<PageProps> = (props) => {
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
export const renderPage = (props: PageProps): string => raw(<Page { ...props } />).toString(); 


/**
 * Dir 컴포넌트
 */
export type DirProps = { title: string, updated: string, pages: PageProps[], sort: string };
const Dir: FC<DirProps> = (props) => {
    props.title ??= "#n/a";
    props.updated ??= new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    props.pages ??= [{ title: "#n/a", updated: "#n/a", content: "#n/a", href: "#n/a" }];
    if (props.sort === "desc") props.pages.reverse();

    return (
        <article class="dir">
            <h1 id="page-title">{ props.title }</h1>
            <div class="text-right">Last updated: { props.updated }</div>
            <div class="postlist-body">
                {
                    props.pages.map((page) => (
                        <li><a href={ page.href }>{ page.title }</a><span>, Last updated: { page.updated }</span></li>
                    ))
                }
            </div>
        </article>
    );
};
export const renderDir = (props: DirProps): string => raw(<Dir { ...props } />).toString();


/**
 * Sitemap 컴포넌트
 */
export type SitemapProps = { [pdir: string]: PageProps[] };
const Sitemap: FC<SitemapProps> = (props) => {
    const allpages: PageProps[] = [];
    for (const pages of Object.values(props)) {
        allpages.push(...pages);
    }

    return (
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            { allpages.map((page) => (
                <url>
                    <loc>{ "https://zzinnykko.github.io" + page.href }</loc>
                    <lastmod>{ page.updated }</lastmod>
                </url>
            )) }
        </urlset>
    );
};
export const renderSitemap = (props: SitemapProps): string => `<?xml version="1.0" encoding="UTF-8"?>` + raw(<Sitemap { ...props } />).toString();