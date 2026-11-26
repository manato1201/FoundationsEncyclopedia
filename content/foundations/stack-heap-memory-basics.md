---
name: "スタックとヒープのメモリ領域"
category: IT知識
subcategory: "OS・アーキテクチャ"
summary: "スタックは関数呼び出しの一時的な置き場、ヒープは必要なだけ確保する自由な置き場。"
claim: "スタックは関数が終われば自動で片づき、ヒープは自分で管理する。"
operationSteps:
  - label: "関数を呼び出す"
    note: "関数ごとの作業場所(フレーム)が、スタックの上に積まれる"
  - label: "ローカル変数をスタックに置く"
    note: "関数の中の変数や引数は、フレームの中に置かれる"
  - label: "大きいものや長く使うものはヒープに確保する"
    note: "実行中に大きさが決まるデータなどは、ヒープに確保する"
  - label: "関数が終わるとスタックが戻る"
    note: "フレームが取り除かれ、ローカル変数は自動的に消える"
  - label: "ヒープは解放しないと残る"
    note: "言語によって、手動で解放するか、ガベージコレクションが回収する。解放し忘れるとメモリリークになる"
quiz:
  - question: "関数の中のローカル変数が、関数の終了時に自動で消えるのは、どの領域に置かれているからか"
    choices:
      - "スタック"
      - "ヒープ"
      - "ハードディスク"
    answer: 0
    explanation: "スタックのフレームは、関数が終わると取り除かれる。"
visual:
  kind: zones
  arrows: false
  question: "関数が終わったとき、自動で消えるのはどれ?"
  legend:
    - { key: onStack, label: "スタック上(自動で片づく)", tone: blue, mark: "S" }
    - { key: onHeap, label: "ヒープに確保中", tone: green, mark: "H" }
    - { key: leak, label: "解放されずに残る(リーク)", tone: pink, mark: "!" }
  zones:
    - { id: stack, label: "スタック", note: "関数ごとのフレームが積まれ、終わると戻る" }
    - { id: heap, label: "ヒープ", note: "必要な分を確保。解放は自分か GC" }
  items:
    - { id: frame, label: "f() のフレーム" }
    - { id: local, label: "int local = 1" }
    - { id: p, label: "int *p" }
    - { id: obj, label: "*p の中身 = 2" }
  steps:
    - short: "呼び出し"
      place: { frame: stack }
      state: { frame: onStack }
      zoneFocus: [stack]
      verdict: "f() を呼ぶと、f 用の作業場所(フレーム)がスタックの上に積まれる"
    - short: "ローカル変数"
      place: { local: stack, p: stack }
      state: { local: onStack, p: onStack }
      highlight: [local, p]
      verdict: "local と p は、f のフレームの中に置かれる"
    - short: "ヒープに確保"
      place: { obj: heap }
      state: { obj: onHeap }
      highlight: [p, obj]
      zoneFocus: [heap]
      verdict: "malloc で確保した領域はヒープにあり、p はその場所を指しているだけ"
    - short: "関数が終わる"
      place: { frame: null, local: null, p: null }
      highlight: [obj]
      zoneFocus: [stack]
      verdict: "○ フレームが取り除かれ、local も p も自動で消える。ヒープの領域は残ったまま"
    - short: "解放しないと残る"
      state: { obj: leak }
      highlight: [obj]
      zoneFocus: [heap]
      verdict: "× 指す変数が消えても、解放しなければ残り続ける(メモリリーク)。free で解放するか、GC が回収する"
  summary:
    columns: ["スタック", "ヒープ"]
    rows:
      - { label: "片づけ", cells: ["○ 関数の出入りで自動", "△ free か GC が要る"] }
      - { label: "速さ", cells: ["○ 速い", "△ 確保と解放に手間"] }
      - { label: "大きさ", cells: ["△ 小さめ", "○ 大きい・実行中に決められる"] }
      - { label: "よくある失敗", cells: ["深すぎる再帰であふれる", "解放し忘れでリーク"] }
---

## 概要

プログラムが使うメモリには、主に**スタック**と**ヒープ**がある。スタックは、関数の呼び出しごとに自動で確保・解放される、速くて小さな領域。ヒープは、実行中に必要な分を確保する、大きくて自由な領域で、解放の管理が必要になる。

## 基礎文法

| 領域 | 管理 | 特徴 |
| --- | --- | --- |
| スタック | 自動(関数の出入りで) | 速い・容量は小さめ |
| ヒープ | 手動またはGC | 大きい・確保と解放に手間がかかる |

## つまずきやすい点

- 再帰が深すぎると、スタックが足りなくなり、スタックオーバーフローになる
- ヒープを確保したまま使わなくなると、メモリリークになる。GCのある言語でも、参照を持ち続けると回収されない
- ローカル変数のアドレスを、関数の外へ返してはいけない(C/C++)。関数が終わると、その領域は無効になる

## 実装例(コード)

```c
#include <stdlib.h>

void f(void) {
    int local = 1;                 // スタック
    int *p = malloc(sizeof(int));  // ヒープ
    *p = 2;
    free(p);                       // 手動で解放する
}
```
