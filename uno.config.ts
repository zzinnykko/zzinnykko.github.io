import extractorPug from "@unocss/extractor-pug";
import { defineConfig, presetWind3, transformerDirectives } from "unocss";
import fs from "fs-extra";

export default defineConfig({
    presets: [
        presetWind3(),
    ],
    extractors: [
        extractorPug(),
    ],
    transformers: [
        transformerDirectives(),
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