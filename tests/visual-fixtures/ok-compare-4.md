---
name: "検証用: compare(4 列)"
category: Framework
subcategory: "Web(Next.js等)"
summary: "4 列の compare が 390px でつぶれないかの確認用。エラー 0 件であること。"
expectErrors: []
operationSteps:
  - label: "HTML をいつ作るか"
  - label: "最初の表示の速さ"
  - label: "データの新しさ"
visual:
  kind: compare
  question: "ページの HTML は、いつ・どこで作る?"
  columns:
    - { id: csr, label: "CSR", tag: "BROWSER", tone: blue, units: { count: 12, cols: 4 } }
    - { id: ssr, label: "SSR", tag: "REQUEST", tone: green, units: { count: 12, cols: 4 } }
    - { id: ssg, label: "SSG", tag: "BUILD", tone: violet, units: { count: 12, cols: 4 } }
    - { id: isr, label: "ISR", tag: "REVALIDATE", tone: amber, units: { count: 12, cols: 4 } }
  steps:
    - cells:
        csr: { lit: 12, order: row, text: "ブラウザで JS が組み立てる" }
        ssr: { lit: 12, order: all, text: "要求のたびにサーバーで作る" }
        ssg: { lit: 12, order: all, text: "ビルドのときに作っておく" }
        isr: { lit: 12, order: diagonal, text: "作っておき、時間で作り直す" }
    - cells:
        csr: { lit: 3, mark: fair, text: "JS の読み込みを待つ" }
        ssr: { lit: 9, mark: good, text: "完成した HTML が届く" }
        ssg: { lit: 12, mark: good, text: "配るだけ" }
        isr: { lit: 12, mark: good, text: "配るだけ" }
    - cells:
        csr: { lit: 12, mark: good, text: "その場で取りに行く" }
        ssr: { lit: 12, mark: good, text: "要求のたびに新しい" }
        ssg: { lit: 4, mark: poor, text: "次のビルドまで古い" }
        isr: { lit: 8, mark: fair, text: "決めた間隔で新しくなる" }
  summary:
    columns: ["CSR", "SSR", "SSG", "ISR"]
    rows:
      - { label: "最初の表示", cells: ["△ JS 待ち", "○ 速い", "○ 最速", "○ 最速"] }
      - { label: "データの新しさ", cells: ["○ 常に新しい", "○ 常に新しい", "× ビルド時", "△ 間隔しだい"] }
---

検証用のフィクスチャ(章ではない)。開発時だけ `/dev/visuals` で表示する。
