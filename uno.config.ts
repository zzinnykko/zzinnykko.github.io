import { defineConfig, presetWind3, transformerDirectives, transformerVariantGroup } from "unocss";


const reset = /* css */ `

`;


export default defineConfig({
    cli: {
        entry: {
            outFile: "./_site/global.css",
            patterns: ["./layouts/**/*.tsx"],
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
        transformerVariantGroup(),
    ],
});