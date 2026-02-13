import fs from "fs-extra";
import { renderPage, PageProps, renderDir, DirProps, renderSitemap, SitemapProps } from "./layouts/components.tsx";
import { renderLayout, LayoutProps } from "./layouts/layouts.tsx";


/**
 * index.html, 404.html, sitemap.xml 만들기
 */
const dirpages = await fs.readJSON("./_site/dirpages.json", { encoding: "utf-8" });
const html = renderLayout({ dirs: dirpages["./dir"] });

await fs.writeFile("./_site/index.html", html, { encoding: "utf-8" });
await fs.copy("./_site/index.html", "./_site/404.html");
await fs.writeFile("./_site/sitemap.xml", renderSitemap(dirpages), { encoding: "utf-8" });

/**
 * font 복사
 */
await fs.copy("./resources/font.woff2", "./_site/font.woff2");