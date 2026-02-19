export const partial = true;

import * as path from "path";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Page from "../../layouts/Page.astro";
type PageInfo = { title: string, updated: string, href: string, content: string }; 

const allpage = await getCollection("page");
const container = await AstroContainer.create();

export async function getStaticPaths() {
    const result = [];
    
    for (const page of allpage) {
        const title = page.data.title ?? "#n/a: no title";
        const updated = page.data.updated ?? new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
        const { name } = path.parse(page.filePath ?? "");
        const slug = name.replace(/\[.*?\]/, "").trim().replace(/\s+/, "_");
        let href = "/page/" + slug;
        if (href === "/page/index") href = "/";
        
        const { Content } = await render(page);
        const content = await container.renderToString(Page, {
            props: { frontmatter: page.data },
            slots: {
                default: await container.renderToString(Content),
            },
        });

        result.push({ params: { slug }, props: { title, updated, href, content } });
    }

    return result;
}

export function GET({ props }: { props: PageInfo }): Response {
    const { title, updated, href, content } = props;

    return new Response(
        JSON.stringify(
            {
                title, updated, href, content
            }
        ),
        {
            status: 200, headers: { "Content-type": "application/json" },
        }
    );
}