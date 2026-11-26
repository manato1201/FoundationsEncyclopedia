---
name: "レンダリング方式の違い(CSR・SSR・SSG)"
category: IT知識
subcategory: "Webの基礎"
summary: "画面をブラウザで作るか(CSR)、サーバーで作るか(SSR)、事前に作っておくか(SSG)の違い。"
claim: "画面を、どこで・いつ作るかで、方式が分かれる。"
operationSteps:
  - label: "CSR: ブラウザで作る"
    note: "最小のHTMLとJavaScriptが届き、ブラウザがデータを取得して、画面を組み立てる"
  - label: "SSR: リクエストごとにサーバーで作る"
    note: "サーバーが、リクエストのたびにHTMLを作って返す"
  - label: "SSG: ビルド時に作っておく"
    note: "ビルドのときにHTMLを作っておき、リクエストにはそのファイルを返す"
  - label: "速さと新しさを比べる"
    note: "SSGは速いが内容が固定。SSRは常に新しい。CSRは最初の表示が遅くなりやすい"
  - label: "ページの性質で選ぶ"
    note: "ほとんど変わらないページはSSG、毎回変わるページはSSR、操作が多い部分はCSR、と組み合わせる"
quiz:
  - question: "ビルド時にHTMLを作っておく方式はどれか"
    choices:
      - "SSG"
      - "CSR"
      - "SSR"
    answer: 0
    explanation: "SSGは、事前に作ったHTMLを返すので、速くて安い。"
visual:
  kind: compare
  question: "8 回のアクセスで、HTML はどこで・何回作られる?"
  columns:
    - { id: csr, label: "CSR", tag: "BROWSER", tone: cyan, units: { count: 8, cols: 4, label: "HTML を作る回数(8 回のアクセス)" } }
    - { id: ssr, label: "SSR", tag: "PER REQUEST", tone: amber, units: { count: 8, cols: 4, label: "HTML を作る回数(8 回のアクセス)" } }
    - { id: ssg, label: "SSG", tag: "BUILD TIME", tone: green, units: { count: 8, cols: 4, label: "HTML を作る回数(8 回のアクセス)" } }
  steps:
    - short: "CSR"
      cells:
        csr: { lit: 8, order: all, text: "各ブラウザが画面を組み立てる", note: "届くのは最小の HTML と JS" }
        ssr: { lit: 0, note: "次の段で" }
        ssg: { lit: 0, note: "次の段で" }
      verdict: "CSR は、データの取得も組み立ても、ブラウザで行う"
    - short: "SSR"
      cells:
        csr: { lit: 8, order: all, text: "ブラウザで組み立てる" }
        ssr: { lit: 8, order: row, text: "アクセスのたびにサーバーで作る", note: "中身の入った HTML が届く" }
        ssg: { lit: 0, note: "次の段で" }
      verdict: "SSR は、リクエストごとにサーバーで作る"
    - short: "SSG"
      cells:
        csr: { lit: 8, order: all, text: "ブラウザで組み立てる" }
        ssr: { lit: 8, order: row, text: "アクセスのたびに作る" }
        ssg: { lit: 1, order: all, text: "ビルド時に 1 回だけ作る", note: "以後は同じファイルを返す" }
      verdict: "SSG は、作り置きの HTML を返す"
    - short: "速さと新しさ"
      cells:
        csr: { lit: 8, order: all, mark: fair, text: "最初の表示が遅れやすい", note: "表示後の操作は滑らか" }
        ssr: { lit: 8, order: row, mark: good, text: "毎回作るので常に新しい", note: "そのぶんサーバーの負荷" }
        ssg: { lit: 1, order: all, mark: good, text: "作り置きを返すので速い", note: "内容は再ビルドまで固定" }
      verdict: "速さは SSG、新しさは SSR。CSR は最初の表示に注意"
    - short: "選び方"
      cells:
        csr: { lit: 8, order: all, mark: good, text: "操作が多い部分に" }
        ssr: { lit: 8, order: row, mark: good, text: "毎回変わるページに" }
        ssg: { lit: 1, order: all, mark: good, text: "ほとんど変わらないページに" }
      verdict: "1 つのアプリでも、ページごとに組み合わせられる"
  summary:
    title: "どこで・いつ作るか"
    columns: ["CSR", "SSR", "SSG"]
    rows:
      - { label: "作る場所・時", cells: ["ブラウザ", "サーバー(リクエストごと)", "ビルド時"] }
      - { label: "最初の表示", cells: ["△ 遅れやすい", "○ 中身入りで届く", "○ 速い"] }
      - { label: "内容の新しさ", cells: ["○ その場で取得", "○ 常に新しい", "△ 再ビルドまで固定"] }
      - { label: "向くページ", cells: ["操作が多い部分", "毎回変わるページ", "ほとんど変わらないページ"] }
    note: "Next.js などでは、1 つのアプリの中でページごとに方式を使い分けられる。"
---

## 概要

Webページの画面(HTML)を、どこで、いつ作るかで、方式が分かれる。**CSR**(クライアントサイドレンダリング)は、ブラウザで作る。**SSR**(サーバーサイド)は、リクエストごとにサーバーで作る。**SSG**(静的サイト生成)は、ビルド時に作っておく。

## 基礎文法

| 方式 | 作る場所・時 | 特徴 |
| --- | --- | --- |
| CSR | ブラウザ | 操作が滑らか。最初の表示が遅くなりやすい |
| SSR | サーバー(リクエストごと) | 常に新しい内容。サーバーの負荷がある |
| SSG | ビルド時 | 速い・安い。内容の更新には再ビルドが要る |

## つまずきやすい点

- 1つのアプリの中で、ページごとに方式を使い分けられる(Next.jsなど)
- SSGのページは、内容が変わったら、再ビルドしないと反映されない。更新の頻度を考えて選ぶ
- 検索エンジンへの見え方も、方式で変わる場合がある。HTMLに内容が含まれているかを確認する

## 実装例(コード)

```tsx
// Next.js(App Router)の例: 変更が少ないページは、既定で静的に作られる
export default function Page() {
  return <h1>About</h1>;
}
```
