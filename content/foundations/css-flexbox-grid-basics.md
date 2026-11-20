---
name: "FlexboxとGridの基礎"
category: IT知識
subcategory: "Webの基礎"
summary: "要素を並べる2つのレイアウト機能。Flexbox は1方向(行か列)、Grid は2方向(行と列)の並びを作る。"
claim: "1方向の並びは Flexbox、行と列の格子は Grid。"
operationSteps:
  - label: "親要素にdisplayを指定する"
    note: "並べたい要素の親に、`display: flex` か `display: grid` を指定する。子が、配置の対象になる"
  - label: "Flexboxは1方向に並べる"
    note: "既定では横一列。`justify-content` で主軸(並ぶ方向)、`align-items` で交差軸の揃え方を決める"
  - label: "余白とはみ出しを決める"
    note: "`gap` で要素の間隔、`flex-wrap: wrap` で、入りきらないときに折り返しを指定する"
  - label: "Gridは行と列を定義する"
    note: "`grid-template-columns: repeat(3, 1fr)` で、等幅の3列を作る。子は、自動で格子に入る"
  - label: "子の大きさを調整する"
    note: "Flexは `flex: 1`(余りを分け合う)、Gridは `grid-column: span 2`(2列分を占める)などで調整する"
quiz:
  - question: "カード一覧を、3列の格子として並べたい。向いているのはどれか"
    choices:
      - "Flexbox のみ"
      - "Grid"
      - "float"
    answer: 1
    explanation: "行と列の2方向で並べるなら Grid が向く。Flexbox は、1方向の並びや、余白の分配が得意。"
---

## 概要

CSSでの要素の並べ方は、長い間、工夫が必要だった。現在は、**Flexbox**と**Grid**の2つの機能が標準になっている。**Flexbox**は、要素を一方向(横か縦)に並べて、余白の配分や揃え方を決める。**Grid**は、行と列の格子を定義して、要素を配置する。どちらも、親に`display`を指定すると、その子が配置の対象になる。要素の大きさの基本は[ボックスモデル](/foundations/css-box-model-basics)を参照。

## 基礎文法

```css
/* Flexbox: ナビゲーションを横に並べ、右端に寄せる */
.nav {
  display: flex;
  gap: 16px;
  align-items: center;          /* 縦方向の揃え */
  justify-content: space-between; /* 横方向は、両端に振り分ける */
}

/* Grid: 3列の格子 */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 等幅の3列 */
  gap: 16px;
}
```

| プロパティ | 対象 | 意味 |
| --- | --- | --- |
| justify-content | Flex | 主軸(並ぶ方向)の配分 |
| align-items | Flex・Grid | 交差軸の揃え |
| gap | Flex・Grid | 要素の間隔 |
| flex: 1 | Flexの子 | 余った幅を、均等に分け合う |
| 1fr | Gridの列 | 余った幅の1単位 |

## つまずきやすい点

- `flex-direction: column`にすると、主軸が縦になり、`justify-content`と`align-items`の方向も入れ替わる
- Flexboxで折り返したときの、2行目以降は、1行目と、列がそろわない。格子にしたいときは、Gridを使う
- `1fr`は、余った空間の比率。中身が大きいと、均等に分けられないことがある。固定にしたいときは、`minmax()`を使う
- 古い環境向けの`float`や、`position`での配置を、レイアウトの目的で使い続けない。今の用途に合った機能で、書く

## 実装例(コード)

```css
/* 画面幅に応じて、列数が自動で変わるカード一覧 */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* カードの中は、縦に並べて、ボタンを下端に寄せる */
.card {
  display: flex;
  flex-direction: column;
}
.card button {
  margin-top: auto;
}
```
