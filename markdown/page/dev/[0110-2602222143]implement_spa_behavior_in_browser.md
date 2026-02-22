---
layout: "page"
title: "브라우저에서 SPA 구현 (인터넷 주소가 페이지 이동이 아닌 페이지 로드가 되도록 만들기)"
updated: "2026-02-22"
---

## 본 블로그 적용 SPA 방식

본 블로그는 SPA 방식으로 구현되어있음, 즉 블로그가 로드된 이후, fetch 를 이용하여 주요 콘텐츠를 붙이는 방식임

fetch 트리거는 인터넷 주소임, 인터넷 주소가 변경될 때 실제 웹페이지를 찿는 게 아닌 fetch 가 작동하도록 하여, SPA 지만 주소에 따라 다른 페이지를 이동하는 것처럼 느낄 수 있음

## fetch 가 필요한 세가지 케이스

인터넷 주소가 fetch 트리거가 되려면, 아래와 같은 세가지 케이스에 대해 코드를 작성해야 함

> - 인터넷 주소 직접 입력
> - 브라우저 전/후 이동 버튼 클릭
> - 링크 클릭

브라우저 javascript 이벤트 등을 이용해서 작성함

## 코드

위 세가지 케이스 모두 인터넷 주소가 변경됨, 변경된 주소를 읽어와서 주소에 매칭되는 콘텐츠를 로드하면 됨

아래는 astro 컴포넌트 내에서 작성된 코드이며, 빌드하면 html 안에서 `<script type="module">` 태그 내에서 javascript 로 렌더링 됨

```typescript
// typescript

// 주소에 따라 fetch 하는 함수
// 여기서는 다른 컴포넌트가 실제 fetch 를 담당하기에, 주소에 따른 로드 대상을 계산해서 커스텀 이벤트로 전달 
async function fetchContent() {
    const reqPathname = window.location.pathname;
    const tar = ((reqPathname === "/") ? "/page/index" : reqPathname) + ".json";

    window.dispatchEvent(new CustomEvent("fetch-content", { detail: { tar } }));
}

// 인터넷 주소 직접 입력
await fetchContent();

// 브라우저 전/후 이동 버튼 클릭
window.onpopstate = async () => {
    await fetchContent();
};

// 링크 클릭
document.body.addEventListener("click", async (e) => {
    const el = e.target as HTMLLinkElement;

    // 클릭 태그가 <a> 아니거나,
    // href 도메인이 블로그가 아니거나,
    // 해시태그나 파일(. 으로 판별)이거나,
    // href 가 현재의 주소와 동일하면 동작하지 않고 그냥 리턴
    if (!el.matches("a")) return;
    if (!el.href.startsWith(window.location.origin)) return;
    if (el.href.match(/[#.]/)) return;
    if (el.href === window.location.href) return;

    e.preventDefault();
    history.pushState(null, "", el.href);
    await fetchContent();
});
```

링크 클릭 코드 구현할 때 좀 헤멨는데, `a` 태그에 대해서 클릭 이벤트를 등록하면 작동이 되지 않았음, 구글링해보니 상위 태그에서 클릭 이벤트를 등록해야한다고 해서 `body` 에 대해 이벤트를 등록했음