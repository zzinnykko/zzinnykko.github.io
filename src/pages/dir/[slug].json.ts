export const partial = true;

import * as path from "path";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Dir from "../../layouts/Dir.astro";
type DirInfo = { title: string, updated: string, href: string, content: string }; 

const alldir = await getCollection("dir");
const container = await AstroContainer.create();

export async function getStaticPaths() {
    const result = [];
    
    for (const dir of alldir) {
        const title = dir.data.title ?? "#n/a: no title";
        const updated = dir.data.updated ?? new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
        const { name } = path.parse(dir.filePath ?? "");
        const slug = name.replace(/\[.*?\]/, "").trim().replace(/\s+/, "_");
        let href = "/page/" + slug;
        if (href === "/page/index") href = "/";
        
        // const { Content } = await render(dir);
        const pages = (await getCollection("page")).filter((page) => {
            if (!page.filePath) return false;

            const paths = page.filePath?.split("/");
            return paths && paths.length >= 3 && paths[2] === slug;
        }).sort((a, b) => {
            const x = a.filePath as string;
            const y = b.filePath as string;

            return x.localeCompare(y);
        });
        const sort = dir.data.sort ?? "asc";
        if (sort === "desc") pages.reverse();
        const pagesfrontmatter = pages.map((page) => {
            return {
                ...page.data,
                href: "/page/" + path.parse(page.filePath ?? "").name.replace(/\[.*?\]/, "").trim().replace(/\s+/, "_"),
            };
        });

        const content = await container.renderToString(Dir, {
            props: {
                frontmatter: dir.data,
                pages: pagesfrontmatter,
            },
            // slots: {
            //     default: await container.renderToString(Content),
            // },
        });

        result.push({ params: { slug }, props: { title, updated, href, content } });
    }

    return result;
}

export function GET({ props }: { props: DirInfo }): Response {
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