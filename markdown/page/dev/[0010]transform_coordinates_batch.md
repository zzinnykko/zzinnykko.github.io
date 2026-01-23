---
layout: "page"
title: "localdata의 중부원점좌표(EPSG:5174)를 위/경도로 대량 변환하는 python 코드"
updated: "2026-01-23"
---

[localdata]에 활용할만한 좋은 자료는 많은데 좌표가 중부원점좌표임, 이를 대량으로 위/경도 변환할 필요가 있어 AI 도움을 받아 python 코드를 작성함.

- 의존성
```bash
pip install pandas
```

- 코드
```python
from pyproj import Transformer
import pandas as pd
import os

# 초기화
src_tm = "epsg:5174"
tar_tm = "epsg:4326"    # 위경도 좌표
transformer = Transformer.from_crs(src_tm, tar_tm, always_xy=True)  # always_xy=True --> 경도, 위도 순서로 처리

# 소스 리드
source = pd.read_csv("source.csv")

# 결과 파일 설정
output = "output.csv"
if not os.path.exists(output):
    headers = pd.DataFrame([["ID", "LON", "LAT"]])
    headers.to_csv(output, mode="w", header=False, index=False, encoding="utf-8")

def is_number(v):
    try:
        float(v)
        return True
    except:
        return False

# 위/경도 구해서 결과 파일에 삽입
total = len(source)
for idx, row in source.iterrows():
    x = row["X"]
    y = row["Y"]

    if is_number(x) and is_number(y):
        lon, lat = transformer.transform(x, y)
    else:
        lon, lat = "", ""

    data = pd.DataFrame([[row["ID"], lon, lat]])
    data.to_csv(output, mode="a", header=False, index=False, encoding="utf-8")
    print(f"{idx+1}/{total} 완료")

    # if idx >= 10: break
```
