---
name: "テストピラミッドの基礎"
category: Framework
subcategory: "テスト・CI"
summary: "テストを、速くて安い単体テストを多く、遅くて壊れやすい E2E テストを少なく、という比率で組み合わせる考え方。"
claim: "下の層(単体)ほど多く、上の層(E2E)ほど少なく。速さと信頼性のバランスを取る。"
operationSteps:
  - label: "単体テストを土台にする"
    note: "関数やクラスを1つずつ、短い時間で確かめる。失敗した原因の場所が、すぐ分かる"
  - label: "結合テストでつなぎ目を確かめる"
    note: "データベースや外部サービスとの連携など、部品どうしがつながった状態を確かめる"
  - label: "E2Eで主要な流れだけ"
    note: "ブラウザなどを動かし、ログインから購入のような、重要な流れを、通しで確かめる"
  - label: "上の層ほど件数を絞る"
    note: "上の層は、遅く、環境の影響を受けやすい。件数を絞り、単体では確かめにくい点だけを担当させる"
  - label: "バランスを見直す"
    note: "E2E ばかりで実行が遅くなったら(逆ピラミッド)、下の層のテストへ置き換えられないかを考える"
quiz:
  - question: "テストピラミッドで、最も件数を多くするよう勧められる層はどれか"
    choices:
      - "E2Eテスト"
      - "結合テスト"
      - "単体テスト"
    answer: 2
    explanation: "単体テストは、速くて安定していて、失敗箇所も分かりやすい。そのため土台として、数を多く持つ。"
visual:
  kind: tiers
  question: "どの層のテストを、どれだけ持つ?"
  approx: true
  legend:
    - { key: e2e, label: "E2E テスト", tone: pink }
    - { key: integ, label: "結合テスト", tone: blue }
    - { key: unit, label: "単体テスト", tone: green }
    - { key: many, label: "数を多く持つ", tone: green, mark: "多" }
    - { key: few, label: "件数を絞る", tone: amber, mark: "少" }
    - { key: move, label: "下の層へ移せないか", tone: cyan, mark: "↓" }
  scale: { label: "1 件の実行時間(対数)", ticks: ["1ms", "10ms", "100ms", "1s", "10s"] }
  columns: { value: "1 件の時間", extra: "件数" }
  tiers:
    - { id: e2e, label: "E2E", key: e2e, bar: 88, value: "数秒〜", extra: "少なく" }
    - { id: integ, label: "結合", key: integ, bar: 55, value: "数十ms〜数秒", extra: "中くらい" }
    - { id: unit, label: "単体", key: unit, bar: 12, value: "数ms", extra: "多く" }
  gaps:
    - { id: toE2e, after: e2e, label: "画面やネットワークを通すぶん、遅く不安定になりやすい" }
    - { id: toInteg, after: integ, label: "外部とつなぐぶん、準備と待ち時間が増える" }
  steps:
    - short: "単体"
      reveal: [unit]
      focus: [unit]
      state: { unit: many }
      callout: { value: "数ms", label: "単体 1 件" }
      verdict: "○ 速く、失敗した場所がすぐ分かる。だから土台にして数を多く持つ"
    - short: "結合"
      reveal: [integ]
      focus: [integ]
      verdict: "部品どうしのつなぎ目は、単体では見えない。結合テストで確かめる"
    - short: "E2E"
      reveal: [e2e]
      focus: [e2e]
      callout: { value: "数秒〜", label: "E2E 1 件" }
      verdict: "△ ログインから購入まで通しで確かめられるが、1 件が重い"
    - short: "上ほど絞る"
      focus: [e2e, integ]
      gaps: [toE2e, toInteg]
      state: { integ: few, e2e: few }
      verdict: "上の層ほど遅く、環境の影響を受けやすい。単体では確かめにくい点だけを任せる"
    - short: "見直す"
      focus: [e2e, unit]
      state: { e2e: move }
      verdict: "× E2E ばかりの逆ピラミッドは遅い。下の層で確かめられるものは置き換える"
  summary:
    columns: ["単体", "結合", "E2E"]
    rows:
      - { label: "速さ", cells: ["○ 速い", "△ 中", "× 遅い"] }
      - { label: "安定性", cells: ["○ 壊れにくい", "△ 中", "× 不安定になりやすい"] }
      - { label: "原因の特定", cells: ["○ 容易", "△ 中", "× 難しい"] }
      - { label: "件数", cells: ["多く", "中くらい", "少なく"] }
    note: "比率に決まった正解はない。目的は、速く信頼できて直しやすいテストの集まりを持つこと"
---

## 概要

テストにはいろいろな粒度がある([単体テストと結合テストの違い](/foundations/unit-vs-integration-test)・[E2Eテスト](/foundations/e2e-testing-basics))。それぞれ、確かめられる範囲、実行の速さ、壊れやすさ、直しやすさが違う。**テストピラミッド**は、これらをどんな比率で持つかを示した考え方で、「下ほど多く、上ほど少なく」の三角形で表される。目的は、速いフィードバックを保ちながら、必要な範囲の安心を得ること。

## 基礎文法

| 層 | 速さ | 壊れやすさ | 原因の特定 | 件数の目安 |
| --- | --- | --- | --- | --- |
| 単体 | 速い | 低い | 容易 | 多い |
| 結合 | 中 | 中 | 中 | 中 |
| E2E | 遅い | 高い | 難しい | 少ない |

- 件数の割合に、決まった正解はない。プロジェクトの性質で変わる
- 実行の速さは、CIに組み込む際([CIパイプラインの基本ステージ](/foundations/ci-pipeline-basics))の待ち時間に直結する
- 逆の形(E2Eが多く、単体が少ない)は、「アイスクリームコーン」と呼ばれ、避けるべき形とされる

## つまずきやすい点

- 「ピラミッドの比率に合わせること」自体が目的ではない。目的は、速く、信頼でき、直しやすいテストの集合を持つこと
- E2Eは、ネットワークや画面の待ち時間などで、同じコードでも成否が変わることがある(不安定なテスト)。件数を増やすほど、保守が重くなる
- 単体テストだけだと、部品どうしのつなぎ目の不具合を見落とす。結合テストで補う
- 外部の部品を置き換える(モック)ことで、単体テストを速くできるが、置き換えすぎると、現実と離れる([モックの基礎](/foundations/mocking-basics))

## 実装例(コード)

```json
{
  "scripts": {
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test"
  }
}
```

層ごとに実行コマンドを分けておくと、普段は速い単体テストだけを回し、プルリクエスト時や公開前に、遅い層も実行する、という使い分けができる。
