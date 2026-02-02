// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    remarkPlugins: [removeLayoutPlugin],
  },
  build: {
    format: "file",
  }
});

// Remark 플러그인 정의: 프론트매터에서 layout 속성을 제거하거나 이름을 바꿉니다.
function removeLayoutPlugin() {
  return function (tree, file) {
    // Astro는 마크다운의 프론트매터를 file.data.astro.frontmatter에 담습니다.
    if (file.data.astro && file.data.astro.frontmatter) {
      const { frontmatter } = file.data.astro;
      
      if (frontmatter.layout) {
        // layout을 _layout으로 옮겨서 에러를 방지하고 데이터는 보존합니다.
        frontmatter._layout = frontmatter.layout;
        delete frontmatter.layout;
      }
    }
  };
}