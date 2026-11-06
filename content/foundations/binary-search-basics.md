---
name: "二分探索の基礎"
category: IT知識
subcategory: "データ構造・計算量"
summary: "並べ替え済みのデータを、真ん中と比べながら半分ずつに絞って、目的の値を探す。"
claim: "二分探索は、探す範囲を毎回半分にする。"
operationSteps:
  - label: "並べ替え済みであることを確認する"
    note: "二分探索は、データが昇順などに整列していることが前提"
  - label: "探す範囲の両端を決める"
    note: "最初は、配列の先頭(low)と末尾(high)を範囲にする"
  - label: "真ん中の値と比べる"
    note: "中央の要素が、探す値と等しいかを確認する"
  - label: "半分を捨てる"
    note: "探す値が中央より小さければ左半分、大きければ右半分だけを残す"
  - label: "見つかるか、範囲が空になるまで繰り返す"
    note: "毎回、範囲が半分になるので、計算量はO(log n)になる"
quiz:
  - question: "二分探索の計算量はどれか"
    choices:
      - "O(log n)"
      - "O(n)"
      - "O(n²)"
    answer: 0
    explanation: "探す範囲が毎回半分になるので、O(log n)。"
---

## 概要

**二分探索**は、整列済みの配列から目的の値を探す方法。中央の値と比べて、探す範囲を毎回半分にする。要素が100万個あっても、確認は約20回で済む。先頭から順に調べる線形探索は、最大100万回かかる。

## 基礎文法

| 方法 | 計算量 | 前提 |
| --- | --- | --- |
| 線形探索 | O(n) | なし |
| 二分探索 | O(log n) | 整列済み |

## つまずきやすい点

- 整列していないデータには使えない。先に並べ替えるコストも考える
- 範囲の端の扱い(`<` か `<=` か、mid±1)を間違えると、無限ループになったり、見落としたりする
- 言語によっては、`(low + high) / 2` が整数の範囲を超える場合がある。`low + (high - low) / 2` と書くと安全

## 実装例(コード)

```python
def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```
