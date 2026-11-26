# 章の図(`visual:`)の書き方

章の frontmatter に `visual:` を書くと、その章の中身を 6 つの型のどれかで、手順に合わせて動く図にする。
書いていない章は「手順トラック」(手順の一覧を段として見せる)になる。

- データの形(正): [`src/lib/visual/schema.ts`](../../src/lib/visual/schema.ts)(型と `validateVisual`)
- 検証: `npm run verify:visuals`(全章+[`tests/visual-fixtures/`](../../tests/visual-fixtures/) の自己テスト)
- 見本の章: `git-staging-area-basics`(zones)・`cpu-memory-basics`(tiers)・`cpu-gpu-npu`(compare)・`https-tls-basics`(sequence)。grid と graph はフィクスチャ `ok-grid.md`・`ok-graph.md`
- 開発サーバーで `/dev/visuals` を開くと、フィクスチャを実際の枠で見られる(本番では 404)

## 共通の約束

| 項目 | 必須 | 意味 |
|---|---|---|
| `kind` | ○ | `zones` / `tiers` / `compare` / `grid` / `sequence` / `graph` |
| `question` | ○ | 図の問いかけ(枠の副題)。「commit されるのは、どの変更?」の形 |
| `steps` | ○ | **段の数・順は `operationSteps` と同じ**。段の題名・注記は `operationSteps` から出る |
| `legend` | 型による | `[{ key, label, tone?, mark? }]`。状態の色。`tone` は blue / green / amber / pink / violet / cyan / gray。`mark` は箱に添える 1〜2 文字(省略時は label の 1 文字目) |
| `summary` | | 最後の段で出すまとめ。一言(文字列)か `{ title?, columns, rows: [{ label, cells }], note? }` |
| `approx` | | `true` で「数値は目安」を出す。文字列ならその文言 |
| `eyebrow` | | 英字の小ラベルの上書き(既定はカテゴリ/サブカテゴリの英字) |

段(`steps[i]`)に書ける共通の項目: `short`(進み具合の帯の短い名前)・`verdict`(段の結論の一言)・`callout: { value, label? }`(右上の大きな数)。
`verdict` と `summary` の表のセルは、先頭に `○` `△` `×` を置くと評価記号(得意・条件つき・苦手)として描く。

**段は差分で書く**: `place`・`state`・`cells`・`nodes` などは前の段の値を引き継ぎ、書いたキーだけ上書きする。
`focus`・`highlight`・`zoneFocus`・`send` は**その段だけ**(引き継がない)。

## zones — 場所の間を、ものが移動する

必須: `zones`・`items`・`steps[0].place`(最初に置く場所)。

```yaml
visual:
  kind: zones
  question: "commit されるのは、どの変更?"
  legend:
    - { key: edited, label: "編集済み", tone: amber, mark: "M" }
    - { key: staged, label: "ステージ済み", tone: blue, mark: "S" }
  zones: [{ id: work, label: "作業ツリー", note: "ふだん編集する場所" }, { id: stage, label: "ステージ" }]
  items: [{ id: a, label: "a.txt の変更" }]
  steps:
    - { place: { a: work }, state: { a: edited } }
    - { place: { a: stage }, state: { a: staged }, highlight: [a], verdict: "○ a だけが次のコミットへ" }
```

- `place` の値を `null` にすると、その段から消える。`zoneFocus: [stage]` で場所の枠を強調する。
- 場所の間の矢印(→)は、流れの順がある場所のためのもの。スタックとヒープのように順がない場所は `arrows: false`。
- 長いチップ名は切らずに折り返す。

## tiers — 階層+数値の棒+段の間の断層

必須: `scale.label`・`tiers`(各 `bar` は 0〜100)。

```yaml
visual:
  kind: tiers
  question: "欲しいデータは、どの層で見つかる?"
  approx: true
  legend: [{ key: sram, label: "キャッシュ", tone: amber }, { key: miss, label: "なかった", tone: gray, mark: "×" }]
  scale: { label: "アクセスの時間(対数)", ticks: ["1ns", "10ns", "100ns"] }
  columns: { value: "時間", extra: "容量" }
  tiers:
    - { id: l1, label: "L1", key: sram, bar: 5, value: "~1ns", extra: "数十KB" }
    - { id: dram, label: "DRAM", bar: 95, value: "~100ns", extra: "数GB〜" }
  gaps: [{ id: g1, after: l1, label: "約 100 倍" }]
  steps:
    - { focus: [l1], state: { l1: miss } }
    - { focus: [dram], gaps: [g1], callout: { value: "~100×", label: "L1 → DRAM" } }
```

- `bar` は書き手が目盛り(`ticks` を左から等間隔)に合わせて決める。対数目盛なら桁の位置。
- 最初の段で `reveal` を書かなければ全部の階層を見せる。書けば、その段から順に出す。
- **数値は広く知られた桁の目安だけ**。確信のない数値は書かない。数値を出す図は `approx: true`。

## compare — 2〜4 列の横並びパネル

必須: `columns`(2〜4 列、各 `units.count` は 1〜64)。

```yaml
visual:
  kind: compare
  question: "同じ計算を、3 つはどう進める?"
  columns:
    - { id: cpu, label: "CPU", tag: "SEQUENTIAL", tone: cyan, units: { count: 16, cols: 4, label: "16 回の掛け算" } }
    - { id: gpu, label: "GPU", tag: "PARALLEL", tone: green, units: { count: 16, cols: 4 } }
  steps:
    - cells:
        cpu: { lit: 16, order: row, text: "1 つずつ順番に" }
        gpu: { lit: 16, order: all, mark: good, text: "全部を同時に" }
```

- `order`: `row`(1 つずつ順に点灯)・`all`(一斉)・`diagonal`(斜めの波=流れ作業)。
- `cells` は**引き継がない**(段ごとに全列を書く)。`units.label` を書いた列だけ「点灯数 / 全体」を出す。
- 狭い画面では 2 列 → 1 列に積む。`text` は短く(20 字前後)。

## grid — マスが埋まる/光る/走査される

必須: `rows`・`cols`(各 16 まで)。番地は `"行,列"`(0 始まり)。

```yaml
visual:
  kind: grid
  question: "grid[r][c] は、どのマスを指す?"
  legend: [{ key: set, label: "書き込んだ", tone: green }, { key: read, label: "読んだ", tone: blue }]
  rows: ["0", "1"]
  cols: ["0", "1", "2"]
  rowLabel: "行 r"
  colLabel: "列 c"
  steps:
    - { cells: { "0,2": set }, values: { "0,2": "7" }, focus: ["0,2"] }
    - { cells: { "1,0": read, "1,1": read }, focus: ["1,1"] }
```

- `initial` で最初の文字(rows × cols の 2 次元配列)を入れられる。`clear: true` でその段の前に空に戻す。

## sequence — 登場者の間をメッセージが行き来する

必須: `actors`(5 人まで)・`messages`(`from`・`to` は actors の id)。

```yaml
visual:
  kind: sequence
  question: "安全な通信は、どんな順で始まる?"
  legend: [{ key: hs, label: "ハンドシェイク", tone: blue }, { key: shared, label: "共通鍵を持つ", tone: violet }]
  actors: [{ id: client, label: "クライアント" }, { id: server, label: "サーバー" }]
  messages:
    - { id: hello, from: client, to: server, label: "ClientHello", note: "使える方式の一覧", key: hs }
    - { id: verify, from: client, to: client, label: "証明書を検証" }
  steps:
    - { send: [hello] }
    - { send: [verify], state: { client: shared } }
```

- `from` と `to` が同じなら自分の中での処理(小さな輪)。同じメッセージを 2 回送らない(検証でエラー)。
- 送る前のメッセージも場所だけ取ってあるので、段が進んでも図の高さは変わらない。

## graph — ノードとエッジ

必須: `nodes`(`x`・`y` は 0〜100、左上が 0)・`edges`。エッジの id は既定で `"from>to"`。

```yaml
visual:
  kind: graph
  question: "幅優先探索は、どの順に訪ねる?"
  legend: [{ key: visited, label: "訪問済み", tone: green }, { key: path, label: "最短の道", tone: blue }]
  nodes: [{ id: A, label: "A", x: 10, y: 50 }, { id: B, label: "B", x: 90, y: 50 }]
  edges: [{ from: A, to: B }]
  steps:
    - { nodes: { A: visited }, notes: { A: "0" }, focus: [A] }
    - { nodes: { B: visited }, edges: { "A>B": path }, focus: [B] }
```

- ノードの名前は短く(1〜6 文字)。札の幅は名前に合わせて伸びる。`directed: true` で矢印。
- **まだ存在しないもの**(rebase で作り直す前のコミット・まだ作っていないコレクションなど)は、ノード・エッジに `hidden: true` を付ける。状態(`nodes` / `edges`)が付く段で現れる。隠れたノードにつながるエッジも隠れる。
- 縦の行が近いノード同士(横にも重なる位置)は、図が自動で縦に伸びて重ならないようにする。
- 390px では図全体が縮むので、文字は 10px 前後になる。1 行に並べるノードは 5 個程度まで。

## よくある誤り(検証のエラー文)

| エラー | 直し方 |
|---|---|
| `steps の数(3)が operationSteps の数(4)と違う` | 段を足す/減らす。手順の文言を図に合わせて直すのはよいが、意味は変えない |
| `未定義の zone「stg」` など | id の綴り。参照先(zones・items・tiers・actors・messages・nodes・edges・columns)に同じ id があるか |
| `凡例にないキー「hot」` | `legend` に `key: hot` を足すか、既存のキーに直す |
| `steps[0].place で、最初に置くものの場所を決める` | zones の最初の段に `place` を書く |
| `マス「3,0」が表の範囲の外` | grid の番地は 0 始まり |
| YAML の解析エラー | `"行,列"` やコロン・`#` を含む文字は引用符で囲む |

検証に通らない章は、画面では図を出さず手順トラックにフォールバックする(ビルドのログに `[visual]` の警告が出る)。
