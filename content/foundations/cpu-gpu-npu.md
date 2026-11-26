---
name: CPU・GPU・NPUの違い
category: IT知識
subcategory: AI基礎
summary: 同じ行列計算でも、CPUは順番に、GPUは同時に、NPUは流れ作業で進める。得意な仕事が違う。
claim: "GPUは同じ計算を一斉に行い、CPUは順番に、NPUは流れ作業で行う。"
guide:
  watch: "同じ16回の掛け算が、3つのパネルで「どの順で点灯するか」を見る。1つずつか、全部同時か、斜めの波(流れ作業)か。"
  caution: "電力の大小は傾向であって実測値ではない。機種や処理内容で変わるので、数字として比べない。"
  misconception: "NPUが常に一番速いわけではない。向いた仕事(ニューラルネットの推論)で力を発揮する専用品。"
quiz:
  - question: "GPUがAIの計算に向いている主な理由はどれか"
    choices:
      - "同じ種類の計算を、多数の演算器で同時に処理できるから"
      - "1つの計算を、世界で一番速く終わらせられるから"
      - "メモリを一切使わずに計算できるから"
    answer: 0
    explanation: "行列計算は「同じ形の掛け算と足し算の大量の繰り返し」なので、並列処理と相性がよい。"
  - question: "NPUの特徴として最も近いものはどれか"
    choices:
      - "OSや一般のアプリを動かす汎用の頭脳である"
      - "重みを回路側に置いたまま、データを流し込んで処理する"
      - "画面の描画だけを担当する"
    answer: 1
    explanation: "ニューラルネットの推論に特化し、データの移動を減らす作りになっているものが多い。"
  - question: "この章の「電力」の扱いとして正しいものはどれか"
    choices:
      - "実測した正確な数値である"
      - "機種を問わず必ず成り立つ法則である"
      - "傾向を示す定性的な目安であり、機種や処理内容で変わる"
    answer: 2
    explanation: "消費電力は製品・設定・処理内容で大きく変わるため、数値ではなく傾向として読む。"
operationSteps:
  - label: "同じ行列計算を、3つの進め方で処理する"
    note: "16 回の掛け算(4×4)を、CPU は 1 つずつ順番に、GPU は全部を同時に、NPU は流れ作業(斜めの波)で進める"
  - label: "分岐の多い処理を比べる"
    note: "OS やアプリのように、条件によって次の処理が分かれる仕事"
  - label: "大量の行列計算を比べる"
    note: "画像処理やニューラルネットのように、同じ形の計算がたくさん並ぶ仕事。NPU はニューラルネットの推論に特化している"
  - label: "電力の傾向を比べる"
    note: "定性的な目安。製品・設定・処理内容で大きく変わるので、数字として比べない"
visual:
  kind: compare
  question: "同じ行列計算を、3つはどう進める? 何が得意?"
  approx: "電力は定性的な傾向(実測値ではない)"
  columns:
    - { id: cpu, label: "CPU", tag: "SEQUENTIAL", tone: cyan, units: { count: 16, cols: 4, label: "16 回の掛け算" } }
    - { id: gpu, label: "GPU", tag: "PARALLEL", tone: green, units: { count: 16, cols: 4, label: "16 回の掛け算" } }
    - { id: npu, label: "NPU", tag: "PIPELINE", tone: pink, units: { count: 16, cols: 4, label: "16 回の掛け算" } }
  steps:
    - short: "進め方"
      cells:
        cpu: { lit: 16, order: row, text: "1 つずつ順番に" }
        gpu: { lit: 16, order: all, text: "全部を同時に" }
        npu: { lit: 16, order: diagonal, text: "重みを回路に置いて流れ作業" }
      verdict: "同じ 16 回の計算でも、進め方が違う"
    - short: "分岐"
      cells:
        cpu: { lit: 16, order: row, mark: good, text: "分岐の多い複雑な処理が得意" }
        gpu: { lit: 16, order: all, mark: fair, text: "処理が分かれると、同時に進めにくい" }
        npu: { lit: 16, order: diagonal, mark: poor, text: "決まった形の計算向け。汎用の処理はしない" }
      verdict: "条件で分かれる仕事は CPU の出番"
    - short: "行列計算"
      cells:
        cpu: { lit: 16, order: row, mark: fair, text: "できるが、数が多いと時間がかかる" }
        gpu: { lit: 16, order: all, mark: good, text: "同じ計算を大量に並べて一斉に" }
        npu: { lit: 16, order: diagonal, mark: good, text: "ニューラルネットの推論に特化" }
      verdict: "同じ形の計算が大量に並ぶ仕事は GPU・NPU の出番"
    - short: "電力"
      cells:
        cpu: { lit: 16, order: row, mark: fair, text: "中くらい" }
        gpu: { lit: 16, order: all, mark: poor, text: "大きくなりがち" }
        npu: { lit: 16, order: diagonal, mark: good, text: "小さく抑えやすい" }
      verdict: "電力は定性的な傾向。機種や処理内容で変わる"
  summary:
    title: "適材適所"
    columns: ["CPU", "GPU", "NPU"]
    rows:
      - { label: "進め方", cells: ["1 つずつ順番に", "全部を同時に", "流れ作業"] }
      - { label: "分岐の多い処理", cells: ["○ 得意", "△ 分かれると遅い", "× 向かない"] }
      - { label: "大量の行列計算", cells: ["△ 時間がかかる", "○ 一斉に計算", "○ 推論に特化"] }
      - { label: "電力の傾向", cells: ["△ 中くらい", "× 大きくなりがち", "○ 小さく抑えやすい"] }
    note: "3 つは競合ではなく分担。CPU が全体を管理し、重い計算を GPU や NPU に任せる構成が一般的。"
---

## 概要

AIの計算は、突き詰めると「行列の掛け算と足し算」の大量の繰り返しになる。この同じ仕事を、CPU・GPU・NPUはそれぞれ違う進め方でこなす。

- **CPU**: 1つずつ順番に。何にでも使える汎用の頭脳
- **GPU**: 全部同時に。同じ種類の計算を大量に並べて処理する
- **NPU**: 重みを回路に置いて流れ作業。ニューラルネットの推論に特化している

## 基礎文法

3つの違いを、進め方・得意な仕事・電力の傾向で並べる。

| 項目 | CPU | GPU | NPU |
| --- | --- | --- | --- |
| 進め方 | 順番に処理 | 同時に処理 | 流れ作業で処理 |
| 得意な仕事 | 分岐の多い複雑な処理、OSやアプリ全般 | 画像処理、行列計算の大量実行 | ニューラルネットの推論 |
| 電力の傾向(定性的な目安) | 中 | 大きくなりがち | 小さく抑えやすい |

## つまずきやすい点

- 電力の列は**定性的な目安**で、実測値ではない。同じ種類の部品でも、製品や設定、処理内容で大きく変わる
- 「NPUが一番速い」とは限らない。NPUは向いた仕事(推論)で力を発揮する専用品で、何でも速くなるわけではない
- 3つは競合ではなく分担。実際の機器では、CPUが全体を管理し、重い計算をGPUやNPUに任せる構成が一般的

## 出典について

ここで述べた3方式の違いは一般的な知識の整理であり、特定の製品の仕様や性能を示すものではない。具体的な性能や消費電力は、各製品の公式資料を確認すること。
