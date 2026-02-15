// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from "@unocss/astro";
import { parsemd } from "./src/lib/lib.ts";

// https://astro.build/config
export default defineConfig({
    integrations: [
        UnoCSS({
            injectReset: true,
        }),
        // setPrerender(),
    ],
    markdown: {
        remarkPlugins: [remarkUpdateFrontmatter],
    },
    vite: {
        server: {
            fs: {
                // 기본 허용 구역(프로젝트 루트)에 'markdown' 폴더를 명시적으로 추가
                allow: [
                '.', // 현재 프로젝트 루트
                './markdown' // 루트 아래의 markdown 폴더
                ]
            }
        },
    },
    build: {
        format: "file",
    }
});

function remarkUpdateFrontmatter() {
    // @ts-ignore
    return function (tree, file) {
        const {astro} = file.data;
        const layout = astro.frontmatter.layout;

        astro.frontmatter.layout = (layout === "dir") ? "/src/layouts/dir.astro" : "/src/layouts/page.astro";
    }
}

// function setPrerender() {
//     return {
//         name: "set-prerender",
//         hooks: {
//             // @ts-ignore
//             "astro:build:generated": async () => {
//                 await parsemd();
//             },
//         },
//     };
// }