# zzinnykko's blog

main 브랜치에서는 _page / _dir 폴더 아래에 각각 포스팅 페이지와 디렉토리(네비게이션 용) 페이지를 마크다운으로 작성

커밋할 때마다 마크다운 렌더링, json 형식으로 포스팅 페이지 / 디렉토리 페이지 / 블로그 외형에 사용되는 네비게이션 코드조각 / sitemap 생성 하여 gh-pages 브랜치에 저장

gs-pages 브랜치에는 astro 사용하여 블로그 외형 작성하여 저장

블로그 외형은 동적으로 포스팅 / 디렉토리 / 네비게이션을 각각 fetch, 특히 SPA 에서 주로 사용하는 기법을 통해 요청한 웹주소 라우팅에 매칭된 json 파일을 fetch 하도록 함

# 기술 스택

node.js 사용, 블로그 외형 생성에는 astro + tailwindcss, 마크다운 렌더링은 markdown-it + highlight.js 등 사용