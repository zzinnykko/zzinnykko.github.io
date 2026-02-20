---
layout: "page"
title: "astro 사용하여 github pages 에 블로그 배포"
updated: "2026-02-20"
---

## astro 프레임워크

기존에 [deno](https://deno.com/) 로 무식하게(?) 만들었던 것을, 세련되게(?) 프레임워크라는 것을 이용해서 만들어 보기로 함

가장 유명한건 [next.js](https://nextjs.org/) 이겠으나 대충 해보니 [astro](https://astro.build/) 가 편해보여서 이걸 사용하기로 함

아래는 astro 로 블로그를 제작하면서 경험한 것들임

## 개발 편의

개발 서버 너무 편함, 물론 deno 로 제작했을 때도 --watch 옵션을 사용하면서, vscode 확장에 있는 live server 돌리면서 했었으나 더 편함

deno 로 했을 댄, md 파일 파싱, 블로그 외형 렌더링, atomic css 파싱 코드를 따로따로 실행했었는데 그냥 하나로 다 처리됨

무엇보다도 컴포넌트 중심으로, 그 안에 html, js, css 코드가 다 들어가는 것도 좋음

## import.meta.glob 문제

vite 에서 제공하는 import.meta.glob 은 동적으로 glob 패턴 생성이 안됨, 예를들어 아래와 같이 변수를 사용하면 에러남

```javascript
const allglobs = import.meta.glob(`${ root }/pages/**.*/md`);
```

정적으로 모든 md 를 미리 긁어온 뒤, 필요할 때마다 뽑아써야 함

## 렌더링 순서 조절 불가

나름 효율적인 작업을 한답시고, `/src/lib` 폴더를 만들어서 그 안에 모든 md 파일을 파싱하고, 중요한 정보만 (예를 들면, 페이지 타이틀이나 인터넷주소) 별도 파일로 만들어서 저장

astro 컴포넌트들이 그 저장된 파일을 참고하여 페이지를 구성하도록 함

근데, 이 작업이 순차적으로 진행되게 하는 방법을 찾을 수 없었음, ai 에 물어보면 병렬로 작업한다고 하고 인위적인 렌더링 순서 조절은 어렵다고 함

또한 `astro.config.mjs` 파일에서 훅을 활용하는 법도 해봤으나, 훅에서는 import.meta.glob 이 작동안함. 그래서 포기

## getCollection 사용

import.meta.glob 대신 getCollection 사용을 했음, ai 가 말하길 효율적으로 작동하게끔 구현되어있다고 하니까 믿고 씀

## atomic css

[tailwindcss](https://tailwindcss.com/) 가 가장 유명하나, vscode 확장에서 내가 제대로 코드를 입력했는지 확인이 불편해서, css 코드에 밑줄을 쳐주는 [unocss](https://unocss.dev/) 사용

tailwindcss 든 unocss 든, node 나 deno 에서 날로 사용이 불편했으며, 특히 cli 로 사용할 땐 설정이 매우 복잡한데, 프레임워크에서는 가이드 문서도 많고 쉽게 설정이 가능하여 좋음

html 이 복잡해질 수록 이름짓기도 짜증났는데 이제 편해짐

## 나중에는...

사실 next.js 를 해보고 싶은데, jsx 가 주는 불편함(?) 이 싫어서 안하게 됨, 나중에 해보지 뭐...
