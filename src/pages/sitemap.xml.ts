export const partial = true;

import * as path from "path";
import { getCollection, render } from "astro:content";

const allpage = await getCollection("page");

export async function GET({ site }) {
    // site 설정이 astro.config.mjs에 되어 있어야 합니다.
    const baseUrl = site ? site.href : "https://zzinnykko.github.io/";

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const page of allpage) {
        // const title = page.data.title || "#n/a: no title";
        const updated = page.data.updated || new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
        // Object.assign(page.data, { title, updated });

        const { name } = path.parse(page.filePath ?? "");
        const slug = name.replace(/\[.*?\]/, "").trim().replace(/\s+/, "_");
        let href = "/page/" + slug;
        if (href === "/page/index") href = "/";

        sitemap += `<url><loc>${ new URL(href, baseUrl).href }</loc><lastmod>${ updated }</lastmod></url>`
    }

    sitemap += `</urlset>`;


    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}