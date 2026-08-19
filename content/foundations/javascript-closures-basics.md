---
name: クロージャの基礎
category: プログラミング言語
subcategory: JavaScript
summary: 関数が定義されたときのスコープの変数を、実行後も「覚えている」JavaScriptの言語機能。
---

## 概要

クロージャは、関数が自分の定義された環境(スコープ)の変数を、その外側の関数の実行が終わった後でも参照し続けられる仕組み。JavaScriptでは全ての関数がクロージャであり、カウンタの状態管理やモジュールパターンなど幅広い場面で使われる。

## 基礎文法

```javascript
function createCounter() {
  let count = 0; // この変数はcreateCounterの実行が終わっても生き続ける
  return {
    increment() {
      count += 1;
      return count;
    },
    reset() {
      count = 0;
    },
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
// countはcreateCounterの外から直接アクセスできない(プライベート変数のように振る舞う)
```

## つまずきやすい点

- forループの中で`var`を使ってクロージャを作ると、全てのクロージャが同じ変数を共有してしまい、ループ終了後の最終値を全員が参照する意図しない挙動になる。`let`はループの各回で新しいスコープを作るため、この問題を避けられる
- クロージャは参照している変数をメモリ上に保持し続けるため、不要になったクロージャを参照し続けると、本来ガベージコレクションされるはずの変数が解放されずメモリリークにつながることがある
- クロージャが大きなオブジェクト(DOM要素等)を捕捉していると、そのクロージャが生きている限りそのオブジェクトも解放されない。特にイベントリスナーの登録・解除のバランスが崩れるとこの問題が起きやすい

## 実装例(コード)

```javascript
// forループでのvarとletの違い
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 0); // var: 3, 3, 3
}
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log("let:", i), 0); // let: 0, 1, 2
}
```
