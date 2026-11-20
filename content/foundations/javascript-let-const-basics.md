---
name: "let・const・varの違い"
category: プログラミング言語
subcategory: "JavaScript"
summary: "JavaScriptの変数宣言は3種類。再代入の可否とスコープの範囲が違い、基本は const、必要なときだけ let を使う。"
claim: "変数は const で宣言し、再代入が要るときだけ let を使う。var は使わない。"
operationSteps:
  - label: "constで宣言する"
    note: "`const limit = 3;` のように、宣言と同時に値を入れる。あとから別の値を代入し直せない"
  - label: "再代入が要るならletにする"
    note: "`let count = 0;` は、`count += 1` のように値を入れ替えられる"
  - label: "スコープはブロックの中だけ"
    note: "let と const は、宣言した `{ }` の中でだけ使える"
  - label: "宣言より前には使えない"
    note: "宣言の行より前で参照すると、ReferenceError(一時的デッドゾーン)になる"
  - label: "varは関数スコープ"
    note: "var は `{ }` を無視して関数全体で見えるため、意図しない値の上書きが起きやすい"
quiz:
  - question: "const で宣言した配列に、要素を push できるか"
    choices:
      - "できる(中身の変更は禁止されない)"
      - "できない(const は中身も固定する)"
      - "宣言と同じ行でだけできる"
    answer: 0
    explanation: "const が禁止するのは、変数への再代入だけ。配列やオブジェクトの中身は変更できる。"
---

## 概要

JavaScriptには変数を宣言する書き方が`const`・`let`・`var`の3つある。古くからあるのは`var`で、`let`と`const`はES2015で加わった。現在のコードでは、**まず`const`で書き、再代入が必要になったものだけ`let`にする**のが一般的。こうすると、「この変数は後で変わらない」ことが読み手にも伝わる。

## 基礎文法

| 宣言 | 再代入 | スコープ | 宣言前の参照 |
| --- | --- | --- | --- |
| const | できない | ブロック | ReferenceError |
| let | できる | ブロック | ReferenceError |
| var | できる | 関数 | undefined(宣言は巻き上げられる) |

- `const`は初期値が必須(`const x;`は構文エラー)
- スコープとは、その変数が見える範囲のこと。`if`・`for`・`{ }`で囲んだ部分がブロック

## つまずきやすい点

- `const`は「再代入の禁止」であって、「中身の固定」ではない。`const user = { name: "A" }`のあとで`user.name = "B"`と書くのは問題ない。中身も変えたくないときは`Object.freeze`などを使う
- `var`は`{ }`の外からも見える。`for (var i = 0; ...)`の`i`はループの外でも残り、コールバックの中でその`i`を使うと、最後の値だけが見える、という古典的な不具合の原因になる(クロージャの動きは[クロージャの基礎](/foundations/javascript-closures-basics)を参照)
- `let`・`const`も宣言は巻き上げられているが、宣言の行に来るまでは触れない。この期間を「一時的デッドゾーン」と呼ぶ

## 実装例(コード)

```javascript
const limit = 3;
let count = 0;
while (count < limit) {
  count += 1;
}
console.log(count); // 3

const user = { name: "A" };
user.name = "B"; // 中身の変更はできる
try {
  user = {}; // 再代入は TypeError
} catch (e) {
  console.log(e.name); // "TypeError"
}

{
  let inner = 1;
  var outer = 2;
}
console.log(typeof inner); // "undefined"(ブロックの外からは見えない)
console.log(outer); // 2(var はブロックを越える)
```
