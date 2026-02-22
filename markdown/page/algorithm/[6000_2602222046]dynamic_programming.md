---
layout: "page"
title: "[Dynamic Programming] 동적 계획법 (feat. Memoization)"
updated: "2026-02-22"
---

## 동적 계획법

영문 이름은 Dynamic Programming 인데, 한국어 번역은 동적 계획법임, [나무위키](https://namu.wiki/w/%EB%8F%99%EC%A0%81%20%EA%B3%84%ED%9A%8D%EB%B2%95) 등 이런저런 자료를 찾아봐도 추상적 설명 때문에 이해하기는 어려움

그냥 고등학교 수학 때 배웠던 [점화식](https://namu.wiki/w/%EC%A0%90%ED%99%94%EC%8B%9D)을 생각하면 간단함, `초기값`과 `일반항`으로 구분되며, 수학적 귀납 방식으로 풀어낼 수 있는데, 동적 계획법 풀이가 이와 비슷함

예를들어, `n 팩토리얼`을 구하는 함수를 `f(n)` 이라 하고, 동적 계획법으로 본다면...

> - 초기값: f(1) = 1
> - 일반항: f(n) = f(n - 1) * n

이 되며, 초기값부터 시작 --> 일반항을 이용하여 f(n) 을 반복문이나 재귀함수로 풀어내면 됨

## Leetcode: 70. Climbing Stairs

[https://leetcode.com/problems/climbing-stairs/description](https://leetcode.com/problems/climbing-stairs/description)

계단을 한번에 한계단을 또는 한번예 두계단을 오르는 방법이 있다고 할 때, n 개의 계단을 오르는 방법 가짓수를 구하는 문제

계단이 1 개라면 오르는 방법 가짓수를 1개 뿐, 2 개라면 가짓수는 2 개가 됨 (한계단씩 오르는 방법과 한번에 두계단 오르는 방법 2 가지임)

만일 계단이 n 개라면, n - 2 개 계단을 오르는 방법에서 마지막 2 계단을 한번에 오르는 방법과 n - 1 개 계단을 오르는 방법에서 마지막 1 계단을 오르는 방법이 있음 즉... 초기값과 일반항은 아래와 같음 (보면 알겠지만 피보나치 수열의 변형임)

> - 초기값: f(1) = 1, f(2) = 2
> - 일반항: f(n) = f(n - 2) + f(n - 1)

반복문을 이용한 방법은...

```rust
// rust

impl Solution {
    pub fn climb_stairs(n: i32) -> i32 {
        let (mut a, mut b) = (1, 2);

        for i in 2..=n {
            (a, b) = (b, a + b);
        }

        return a;
    }
}
```

재귀함수를 이용한 방법은...

```rust
// rust

use std::collections::HashMap;

impl Solution {
    pub fn climb_stairs(n: i32) -> i32 {
        let mut h = HashMap::<i32, i32>::new();
        return f(n, &mut h);
    }
}

fn f(n: i32, h: &mut HashMap<i32, i32>) -> i32 {
    return match h.get(&n) {
        Some(&r) => { r },
        None => {
            let r = if n < 3 { n } else { f(n - 2, h) + f(n - 1, h) };
            h.insert(n, r);
            r
        },
    };
}
```

참고로, 재귀함수를 이용할 땐 [Memoization](https://namu.wiki/w/%EB%A9%94%EB%AA%A8%EC%9D%B4%EC%A0%9C%EC%9D%B4%EC%85%98) 기법을 사용해야 함

예를들어 `f(20)` 구할 땐 `f(18) + f(19)` 를 구해야하는데, f(18) 을 구한 뒤, 다시 f(19) 를 구할 때 이미 구한 f(18) 을 또 구해야 함, 즉 시간복잡도가 O(2^n) 으로 최악이 됨

미리 계산된 결과가 있다면 그 결과만 꺼내쓰는 걸 메모이제이션이라 함, 위 f 함수도 h 해시맵을 저장소로 활용함

python 이나 javascript 는 래퍼함수만 구현하여 기존 재귀함수를 그냥 대입하여 쉽게 메모이제이션 구현이 가능한데, rust 는 쉽게 되지 않았음 (걍 본래 함수를 개조해야 함)
