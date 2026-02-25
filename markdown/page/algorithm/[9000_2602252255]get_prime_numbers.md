---
layout: "page"
title: "[Math] 소수 (Prime Number) 구하기"
updated: "2026-02-25"
---

## 소수

소수는 1 과 그 자신으로만 나누어 떨어지는 자연수를 뜻함

이를 구하는 가장 유명한 알고리즘은 [에라토스테네스의 체](https://namu.wiki/w/%EC%97%90%EB%9D%BC%ED%86%A0%EC%8A%A4%ED%85%8C%EB%84%A4%EC%8A%A4%EC%9D%98%20%EC%B2%B4)로 마치 숫자들을 체 위에 부어넣고 걸러지지 않고 남은 숫자들을 골라내는 방식과 닮았기 때문인 듯

## Leetcode: 204. Count Primes

[https://leetcode.com/problems/count-primes](https://leetcode.com/problems/count-primes)

주어진 n 미만의 자연수 중에서 소수 개수를 구하는 문제

에라토스테네스의 체 방식을 그대로 이용하여 풀 수 있음

```rust
// rust

impl Solution {
    pub fn count_primes(n: i32) -> i32 {
        if n < 2 {
            return 0;
        }

        let mut p = vec![true; n as usize];
        p[0] = false;
        p[1] = false;

        for i in 2..((n/2 + 1) as usize) {
            if !p[i] {
                continue;
            }

            for j in ((i * i)..(n as usize)).step_by(i) {
                p[j] = false;
            }
        }

        return p.iter().filter(|x| **x == true).count() as i32;
    }
}
```

n / 2 를 넘지 않는 자연수까지 순회하면되며, 소수의 제곱부터 그 배수를 합성수(소수가 아닌 수)로 보면 됨

미리 인덱스 n 미만의 배열을 준비, 일단 모두 소수로 보고, 순회를 통해 합성수는 false 로 치환하는 방식임

이 방식은 n 이라는 숫자가 주어졌을 때만 가능한데, 구글링을 해보면 제너레이터를 통해 n 이 주어지지 않아도 2 부터 계속 소수를 찾아가는 로직을 찾을 수 있는데, 아래는 이를 rust 로 옮긴 코드임

```rust
// rust

fn primes_iter() -> impl Iterator<Item=i64> {
    let mut n = 2;   
    let mut h = std::collections::HashMap::<i64, Vec<i64>>::new();

    return std::iter::from_fn(move || {
        loop {
            if h.contains_key(&n) {
                let xs = h.remove(&n).unwrap();
                for &x in xs.iter() {
                    h.entry(n + x).and_modify(|v| v.push(x)).or_insert(vec![x]);
                }
                n += 1;
            } else {
                let r = n;
                h.insert(n * n, vec![n]);
                n += 1;
                return Some(r);
            }
        }
        unreachable!();
    });
}

impl Solution {
    pub fn count_primes(n: i32) -> i32 {
        let mut a = 0;

        for x in primes_iter() {
            if !((x as i32) < n) {
                break;
            }
            a += 1;
        }

        return a;
    }
}
```

rust 는 공식적인 제너레이터 문법은 아직 없으나, 제너레이터 흉내낼 수 있는 std::iter::from_fn 함수가 있음

다만 이 방식은 아쉽게도 시간초과로 문제를 통과할 수는 없음, 지속적으로 HashMap 에 값을 삽입 삭제하는데, Vec 보다는 확실히 효율이 떨어지는 모양
