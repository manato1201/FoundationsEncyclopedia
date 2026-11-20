---
name: "セマンティックHTMLの基礎"
category: IT知識
subcategory: "Webの基礎"
summary: "見た目ではなく「意味」に合った要素でページを組み立てる。見出し・ナビ・本文などを要素で示すと、読み上げ・検索・保守に役立つ。"
claim: "要素は、見た目でなく意味で選ぶ。見た目は CSS で決める。"
operationSteps:
  - label: "ページの大まかな領域を決める"
    note: "ヘッダー・ナビ・本文・フッターなど、ページの役割ごとの区分を考える"
  - label: "領域の要素で囲む"
    note: "`<header>`・`<nav>`・`<main>`・`<footer>` で、領域に意味を付ける。`<main>` は、1ページに1つ"
  - label: "見出しの階層を付ける"
    note: "`<h1>` から `<h6>` を、文書の構造に沿って使う。文字の大きさのために選ばない"
  - label: "内容に合う要素を選ぶ"
    note: "段落は `<p>`、リストは `<ul>`・`<ol>`、ボタンは `<button>`、リンクは `<a>`、表は `<table>` を使う"
  - label: "代替の情報を付ける"
    note: "画像には `alt`、フォーム部品には `<label>` を付けて、見えなくても分かるようにする"
quiz:
  - question: "クリックして処理を実行する部品に、最も適した要素はどれか"
    choices:
      - "<div onclick=...>"
      - "<button>"
      - "<span>"
    answer: 1
    explanation: "button は、キーボード操作や読み上げに最初から対応している。div や span では、自分で用意する必要がある。"
---

## 概要

HTMLの要素には、それぞれ意味がある。`<h1>`は見出し、`<nav>`はナビゲーション、`<button>`は操作するボタン。この意味に合った要素を使って書くのが**セマンティックHTML**。見た目は、同じ`<div>`と`<span>`の組み合わせでも作れるが、意味を付けておくと、ブラウザ・スクリーンリーダー・検索エンジンが、ページの構造を正しく理解できる。ブラウザが、HTMLを木構造として扱う仕組みは[DOMの基礎](/foundations/dom-basics)を参照。

## 基礎文法

```html
<body>
  <header>
    <h1>サイト名</h1>
    <nav>
      <ul>
        <li><a href="/">ホーム</a></li>
        <li><a href="/about">概要</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <h2>記事のタイトル</h2>
      <p>本文...</p>
      <img src="chart.png" alt="売上の推移を示す折れ線グラフ">
    </article>
  </main>
  <footer><small>© 2026</small></footer>
</body>
```

| 要素 | 意味 |
| --- | --- |
| header / footer | 見出し部 / 末尾 |
| nav | 主要なナビゲーション |
| main | そのページの主な内容(1ページに1つ) |
| article / section | 独立した記事 / 内容のまとまり |
| aside | 補足的な内容 |

## つまずきやすい点

- 見出しの大きさを変えるために、`<h3>`を使うなど、レベルを飛ばさない。大きさは、CSSで決める
- `<div>`と`<span>`は、意味を持たない。ほかに合う要素がないときだけ、使う
- 画像の`alt`は、飾りだけの画像なら、空(`alt=""`)にして、読み上げ時に飛ばしてもらう。内容を伝える画像には、内容を説明する文を書く
- リンク(`<a>`)は「別のページへ移る」もの、ボタン(`<button>`)は「その場で処理を実行する」もの。取り違えない

## 実装例(コード)

```html
<form action="/subscribe" method="post">
  <label for="mail">メールアドレス</label>
  <input id="mail" name="mail" type="email" required>
  <button type="submit">登録</button>
</form>
```
