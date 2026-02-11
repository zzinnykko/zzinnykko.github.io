import fs from "fs-extra";
import fg from "fast-glob";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";


const srcs = await fg.glob(["./**/*.tsx"]);
const codes = await Promise.all(
    srcs.map(async (src) => await fs.readFile(src, { encoding: "utf-8" }))
);

await postcss([tailwindcss()]).process()


// const uno = await createGenerator(defineConfig);
// const { css } = await uno.generate(await fs.readFile("./resources/source.css", { encoding: "utf-8" }), {
//     id: "source.css"
// });
// await fs.outputFile("./_site/global.css", css, { encoding: "utf-8" });
