import { defineConfig, presetWind3, transformerDirectives } from "unocss";


const reset = /* css */ `

`;


export default defineConfig({
    cli: {
        entry: {
            outFile: "./_site/global.css",
            patterns: ["./resources/*.css", "./layouts/**/*.tsx"],
        },
    },
    preflights: [
        {
            getCSS: () => reset,
        }
    ],
    presets: [
        presetWind3(),
    ],
    transformers: [
        transformerDirectives(),
    ],
});