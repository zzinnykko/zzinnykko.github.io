---
layout: "page"
title: "deno + playwright 으로 사이트 크롤링 코드 조각"
updated: "2026-01-23"
---

deno 런타임으로 playwright 사용, edge 자동화 하면서 겪은 상황들과 이를 해결했던 방법과 코드 모음

나 혼자 사용이 아닌, 개발에 대해 전혀 모르는 사용자들이 그나마 편하게 사용할 수 있도록 하기 위해, exe 배포가 편한 deno 사용, 최신 윈도우라면 무조건 설치가 되어있는 edge 브라우저 자동화 및 크롤링 진행

## 특정 element 클릭

playwright 에서 셀렉터 통해 element 지정한 뒤 클릭할 수 있으나, 클릭 위치가 동일하고 코드가 동일해도 어떤 경우는 클릭, 어떤 경우는 클릭 안되고 작동 멈춰버리는 현상 발생

아래 코드로 클릭 자동화했더니 현재까지 문제없이 일관되게 잘 작동하였음

ai 질의 통해, javascript 주입을 통해 웹브라우저가 스스로 클릭을 하도록 만드는 방법을 사용

```typescript
const btn = page.locator(".btn").first();
await btn.waitFor({ state: 'attached' });
await btn.evaluate((el: HTMLElement) => el.click());
await page.locator(".result").first().waitFor();
```

## allInnerTexts 또는 allTextContents 함수 에러

locator 로 지정한 모든 요소들의 내부 텍스트를 배열로 반환해주는 편리한 함수인데, 경우에 따라 "TypeError: this._engines.set is not a function" 에러가 발생

ai 한테 물어보면 뭐라뭐라하는데 결국 해결방법이 없어서 그냥 무식하게 처리

```typescript
const temp: string[] = [];
const td = page.locator("td");
for (let i = 0, count = await td.count(); i < count; i++) {
    temp.push(await td.nth(i).innerText());
}
```

## 문자열을 csv 형식에 유효한 문자열로 치환

csv 형식은 `,` 로 각 요소를 구분함, 구분자로서가 아닌 실제로 콤마가 포함된 문자열은 앞 뒤로 쌍따옴표를 사용, 행을 구분하기 위한 줄바꿈이 아닌 실제 줄바꿈이 포함된 문자열도 앞 뒤로 쌍따옴표를 사용

따라서, `\n`, `"`, `,` 세개 문자가 포함된 문자열은 쌍따옴표를 앞 뒤로 넣어야 함

다만 일반적인 데이터 처리에 있어서 개행의 경우 그냥 빈칸으로 치환해도 무방한 경우가 많아, 개행을 포함한 공백은 모두 하나의 공백으로만 바꾸고, 쌍따옴표와 콤마의 경우만 쌍따옴표를 붙이는 처리함

ai 가 알려준 아래 코드를 사용

```typescript
function convCsvStr(s: string): string {
    let x = s.replace(/\s+/g, " ").trim();
    if (x.includes(",") || x.includes('"')) {
        x = '"' + x.replace(/"/g, '""') + '"';
    }
    return x;
}
```
