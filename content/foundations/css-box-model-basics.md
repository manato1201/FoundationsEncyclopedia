---
name: "CSSのボックスモデルの基礎"
category: IT知識
subcategory: "Webの基礎"
summary: "すべての要素は、内容・padding・border・margin の4層の箱でできている。width が何を指すかは、box-sizing で決まる。"
claim: "要素は、内側から content・padding・border・margin の箱。実際の幅は、box-sizing で変わる。"
operationSteps:
  - label: "要素は箱として扱われる"
    note: "ブラウザは、すべての要素を、長方形の箱として並べて、ページを組み立てる"
  - label: "4つの層を理解する"
    note: "内側から content(中身)・padding(内側の余白)・border(枠線)・margin(外側の余白)"
  - label: "widthが指す範囲を知る"
    note: "既定(content-box)の width は content だけ。padding と border は、その外側に足される"
  - label: "border-boxにそろえる"
    note: "`box-sizing: border-box` にすると、width が padding と border を含む。指定した幅のまま収まる"
  - label: "marginの重なりに注意する"
    note: "縦に隣り合う要素の margin は、足されず、大きいほうに重なる(マージンの相殺)ことがある"
quiz:
  - question: "width: 200px、padding: 20px(左右)、border: 5px(左右)で、box-sizing が既定(content-box)のとき、要素が占める幅はいくつか"
    choices:
      - "200px"
      - "250px"
      - "240px"
    answer: 1
    explanation: "200 + 20×2 + 5×2 = 250px。border-box なら、全体が 200px に収まる。"
---

## 概要

CSSでは、すべての要素が**箱**として扱われる。箱は、内側から順に、中身(content)・内側の余白(padding)・枠線(border)・外側の余白(margin)でできている。レイアウトのずれの多くは、この箱の大きさの計算を、思い違いすることで起こる。次の章の[Flexbox・Grid](/foundations/css-flexbox-grid-basics)も、この箱を並べる仕組み。

## 基礎文法

```css
.card {
  width: 200px;
  padding: 20px;
  border: 5px solid #888;
  margin: 16px;
}
```

| 層 | 役割 | 背景色 |
| --- | --- | --- |
| content | 文字や画像などの中身 | 付く |
| padding | 中身と枠線の間 | 付く |
| border | 枠線 | (枠線自体) |
| margin | 他の要素との間 | 付かない(透明) |

- 既定の`box-sizing: content-box`では、占める幅は、`width + padding左右 + border左右`
- `box-sizing: border-box`では、`width`が、padding と border を含む全体の幅になる
- ブラウザの開発者ツールの「要素」の欄で、各層の大きさを、図で確かめられる

## つまずきやすい点

- 幅を100%にして、さらにpaddingを足すと、親からはみ出す。`border-box`にしておくと、はみ出しにくい。多くのサイトは、全体に`*, *::before, *::after { box-sizing: border-box; }`を設定している
- 縦方向のmarginは、隣り合う要素どうしで、大きいほうに重なって、足されないことがある。横方向では、重ならない
- `margin`は、背景色が付かない。余白に色を付けたいときは、`padding`を使う
- インライン要素(`<span>`など)は、縦のmargin・widthが効かない。`display: inline-block`や`block`にする

## 実装例(コード)

```css
*,
*::before,
*::after {
  box-sizing: border-box;   /* width に padding と border を含める */
}

.card {
  width: 200px;             /* 全体で 200px(padding・border を含む) */
  padding: 20px;
  border: 5px solid #888;
  margin: 16px auto;        /* 上下 16px、左右は中央寄せ */
}
```
