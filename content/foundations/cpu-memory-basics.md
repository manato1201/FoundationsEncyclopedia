---
name: CPUキャッシュとメモリ階層の基礎
category: IT知識
subcategory: OS・アーキテクチャ
masteryBadge: review
summary: レジスタ→L1/L2/L3キャッシュ→主記憶→ストレージという速度と容量のトレードオフを持つ階層構造。
operationSteps:
  - label: CPUがデータを要求する
  - label: L1キャッシュを確認する
    note: ヒットすれば数ns未満で即座に返る
  - label: L2、L3キャッシュを順に確認する
    note: 見つからなければより大きく低速な階層を順に探す
  - label: 主記憶(DRAM)まで取りに行く
    note: どのキャッシュにもなければ、最も低速な主記憶へアクセスする
visual:
  kind: tiers
  question: "欲しいデータは、どの層で見つかる? そこまで何倍かかる?"
  approx: true
  legend:
    - { key: reg, label: "レジスタ", tone: pink }
    - { key: sram, label: "キャッシュ(SRAM)", tone: amber }
    - { key: dram, label: "主記憶(DRAM)", tone: green }
    - { key: storage, label: "ストレージ(SSD)", tone: violet }
    - { key: miss, label: "なかった(次の層へ)", tone: gray, mark: "×" }
    - { key: hit, label: "見つかった", tone: cyan, mark: "○" }
  scale: { label: "アクセスの時間(対数)", ticks: ["1ns", "10ns", "100ns", "1µs", "10µs", "100µs"] }
  columns: { value: "時間", extra: "容量" }
  tiers:
    - { id: reg, label: "レジスタ", key: reg, bar: 2, value: "1ns 未満", extra: "〜数KB" }
    - { id: l1, label: "L1 キャッシュ", key: sram, bar: 4, value: "~1ns", extra: "数十KB" }
    - { id: l2, label: "L2 キャッシュ", key: sram, bar: 12, value: "数ns", extra: "数百KB〜数MB" }
    - { id: l3, label: "L3 キャッシュ", key: sram, bar: 24, value: "10〜数十ns", extra: "数MB〜数十MB" }
    - { id: dram, label: "主記憶(DRAM)", key: dram, bar: 40, value: "~100ns", extra: "数GB〜数十GB" }
    - { id: ssd, label: "ストレージ(SSD)", key: storage, bar: 92, value: "数十〜100µs", extra: "数百GB〜数TB" }
  gaps:
    - { id: toDram, after: l3, label: "主記憶は L1 の約 100 倍遠い" }
    - { id: toSsd, after: dram, label: "ストレージはさらに約 1000 倍遠い" }
  steps:
    - short: "要求"
      focus: [reg]
      verdict: "計算に使う値は、レジスタになければ近い層から順に探す"
    - short: "L1"
      focus: [l1]
      state: { l1: miss }
      callout: { value: "~1ns", label: "L1 にあれば" }
      verdict: "L1 にあれば約 1ns で返る。今回はなかったので次の層へ"
    - short: "L2・L3"
      focus: [l2, l3]
      state: { l2: miss, l3: miss }
      callout: { value: "~10ns", label: "L3 にあれば" }
      verdict: "下の層ほど大きいが遅い。L2・L3 にもなかった"
    - short: "DRAM"
      focus: [dram]
      state: { dram: hit }
      gaps: [toDram, toSsd]
      callout: { value: "~100×", label: "L1 → DRAM" }
      verdict: "○ 主記憶で見つかった。ただし L1 の約 100 倍の時間がかかる"
  summary: "近い層ほど速くて小さい。よく使うデータが上の層(キャッシュ)に載っているかで、速さが大きく変わる。"
---

## 概要

現代のコンピュータは、CPUに近いほど高速だが容量が小さいメモリ(レジスタ・キャッシュ)と、CPUから遠いほど低速だが容量が大きいメモリ(主記憶・ストレージ)を階層的に組み合わせている。プログラムがよくアクセスするデータをより上位の階層(キャッシュ)に置くことで、実効的な速度と容量を両立させている。

## 基礎文法

代表的な階層(上ほど高速・小容量):

1. レジスタ(CPU内、数ns未満)
2. L1キャッシュ(数KB〜数十KB、1〜数ns)
3. L2キャッシュ(数百KB〜数MB、10ns前後)
4. L3キャッシュ(数MB〜数十MB、数十ns)
5. 主記憶(DRAM、数十GB、100ns前後)
6. ストレージ(SSD/HDD、数百GB〜、μs〜ms)

## つまずきやすい点

- 「キャッシュヒット率」を意識せずにデータ構造を設計すると、理論上の計算量が同じでも実測速度が大きく変わることがある(配列は連続メモリでキャッシュに乗りやすく、連結リストはポインタを辿るたびにキャッシュミスしやすい)
- マルチコアCPUでは各コアが独自のL1/L2キャッシュを持つため、複数スレッドが同じメモリ領域を書き換えるとキャッシュの整合性維持(キャッシュコヒーレンシ)のコストが発生する
- 「メモリが速い」という表現は階層のどの段を指しているかで意味が大きく変わる。ベンチマークの数値を見るときは対象階層を意識する必要がある

## 実装例(コード)

```csharp
// キャッシュに優しい: 連続領域を順にアクセス
int sum = 0;
for (int i = 0; i < array.Length; i++) sum += array[i];

// キャッシュに不利になりやすい: ポインタを辿るたびにメモリ上の位置が飛ぶ可能性がある
var node = linkedList.Head;
while (node != null) { sum += node.Value; node = node.Next; }
```
