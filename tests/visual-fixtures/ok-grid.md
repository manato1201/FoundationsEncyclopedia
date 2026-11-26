---
name: "検証用: grid(2 次元リスト)"
category: IT知識
subcategory: "データ構造・計算量"
summary: "grid 型の動作確認用。エラー 0 件であること。"
expectErrors: []
operationSteps:
  - label: "3 行 4 列の表を用意する"
    note: "行と列の番号は 0 から数える"
  - label: "grid[0][2] に値を入れる"
    note: "行 0・列 2 のマスだけが変わる"
  - label: "行 1 を左から順に読む"
    note: "for 文で列の番号を 0→3 と進める"
  - label: "全部のマスを埋める"
visual:
  kind: grid
  question: "grid[r][c] は、どのマスを指す?"
  legend:
    - { key: empty, label: "空", tone: gray }
    - { key: set, label: "書き込んだ", tone: green }
    - { key: read, label: "読んだ", tone: blue }
  rows: ["0", "1", "2"]
  cols: ["0", "1", "2", "3"]
  rowLabel: "行 r"
  colLabel: "列 c"
  steps:
    - verdict: "まだ空。マスの位置は [行][列] で表す"
    - cells: { "0,2": set }
      values: { "0,2": "7" }
      focus: ["0,2"]
      verdict: "○ 1 マスだけを直接書き換えられる"
    - cells: { "1,0": read, "1,1": read, "1,2": read, "1,3": read }
      focus: ["1,3"]
      verdict: "行の中は列の番号で順に読める"
    - cells: { "0,0": set, "0,1": set, "0,3": set, "1,0": set, "1,1": set, "1,2": set, "1,3": set, "2,0": set, "2,1": set, "2,2": set, "2,3": set }
      verdict: "12 マス = 3 行 × 4 列"
---

検証用のフィクスチャ(章ではない)。開発時だけ `/dev/visuals` で表示する。
