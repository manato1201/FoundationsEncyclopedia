---
name: DOM(Document Object Model)の基礎
category: IT知識
subcategory: Webの基礎
masteryBadge: done
summary: HTML文書をプログラムから操作できるツリー構造のオブジェクトとして表現したもの。
---

## 概要

DOM(Document Object Model)は、ブラウザが読み込んだHTML文書を、JavaScriptから操作できるツリー構造のオブジェクトとして表現したもの。`<div>`や`<p>`のようなHTMLタグはそれぞれDOMツリー上のノードに対応し、JavaScriptからノードの追加・削除・属性の変更などを行うと、画面の表示にリアルタイムに反映される。

## 基礎文法

```javascript
const heading = document.querySelector("h1"); // DOMツリーからノードを取得
heading.textContent = "新しいタイトル"; // ノードの中身を書き換える

const newParagraph = document.createElement("p"); // 新しいノードを作成
newParagraph.textContent = "追加された段落";
document.body.appendChild(newParagraph); // DOMツリーに追加
```

## つまずきやすい点

- DOM操作(要素の追加・削除・スタイル変更)は、ブラウザに再描画(レイアウトの再計算、リフロー)を発生させる可能性があり、頻繁に・大量に行うとパフォーマンスに影響する。ReactやVueのような仮想DOMを使うフレームワークは、実際のDOM操作をまとめて最小限に抑える最適化を内部で行っている
- `innerHTML`に信頼できない文字列を代入すると、[XSSの基礎](/foundations/xss-basics)で触れた脆弱性の入り口になりうる。テキストとして扱いたいだけなら`textContent`を使うのが安全
- HTMLの構文解析結果であるDOMと、CSSの適用結果を含めた実際の描画情報(レンダーツリー、レイアウト情報)は別の概念。「DOM要素は存在するが画面には表示されていない(display: none等)」状態もありうるため、「DOMに存在する=見えている」と決めつけると誤ったデバッグをしてしまうことがある

## 実装例(コード)

```javascript
// イベントリスナーの登録もDOM APIの一部
document.querySelector("button").addEventListener("click", () => {
  console.log("クリックされました");
});
```
