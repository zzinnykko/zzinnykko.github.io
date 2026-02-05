import extractorPug from "@unocss/extractor-pug";
import { defineConfig } from "unocss";
import fs from "fs-extra";

export default defineConfig({
    extractors: [
        extractorPug(),
    ],
    content: {
        pipeline: {
            include: [
                /\.(pug|html)($|\?)/
            ],
        },
    },
    preflights: [
        {
            getCSS: async () => {
                return await fs.readFile("./node_modules/@unocss/reset/eric-meyer.css", { encoding: "utf-8" });
            },
        }
    ],
});