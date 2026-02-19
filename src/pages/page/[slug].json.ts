export const partial = true;

import * as path from "path";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

const allpage = await getCollection("page");
const container = await AstroContainer.create();

export async function getStaticPaths() {
    const result = [];
    
    for (const page of allpage) {
        const title = page.data.title ?? "#n/a: no title";
        const updated = page.data.updated ?? new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
        const { Content } = await render(page);
        const content = await container.renderToString(Content);

        const { dir, name } = path.parse(page.filePath ?? "");
        let href = "/page/" + name.replace(/\[.*?\]/, "").trim().replace(/\s+/, "_");
        const tar = "./parsed" + href + ".json";
        if (href === "/page/index") href = "/";
    }

    // return [
    //     { params: { slug: "xxx" }, props: { "xxx": "yyy" } },
    // ];
}