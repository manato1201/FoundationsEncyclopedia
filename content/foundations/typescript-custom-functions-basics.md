---
name: 自作関数の基礎
category: プログラミング言語
subcategory: TypeScript
masteryBadge: done
summary: function宣言・関数式・アロー関数という3つの書き方があり、thisの挙動がそれぞれ異なる。
---

## 概要

TypeScript(JavaScript)の関数は「function宣言」「関数式」「アロー関数」という3つの主要な書き方を持つ。単に見た目が違うだけでなく、特に`this`(呼び出し元のコンテキストを指すキーワード)の挙動が、アロー関数とそれ以外で大きく異なる。

## 基礎文法

```typescript
// function宣言: 巻き上げられる(定義前でも呼び出せる)
function add(a: number, b: number): number {
  return a + b;
}

// 関数式: 変数への代入。巻き上げられない
const subtract = function (a: number, b: number): number {
  return a - b;
};

// アロー関数: より簡潔。thisを自分では持たず、外側のthisをそのまま使う
const multiply = (a: number, b: number): number => a * b;

// デフォルト引数・オプショナル引数
function greet(name: string, greeting: string = "こんにちは"): string {
  return `${greeting}、${name}さん`;
}
```

## つまずきやすい点

- 通常の`function`で定義したメソッドの中の`this`は、呼び出し方によって指すものが変わる(呼び出し時に決まる)。一方アロー関数は`this`を自分で持たず、定義された時点の外側の`this`をそのまま使う(レキシカルスコープ)。イベントハンドラの中でコールバックを書く際、この違いに起因するバグが非常に多い
- `function`宣言は「巻き上げ(hoisting)」により、コード中でその定義より前の行から呼び出すことができる。関数式・アロー関数は変数への代入なので巻き上げられず、定義前に呼び出すとエラーになる
- 引数の数を厳密にチェックしない([JavaScriptの緩さ](/foundations/javascript-prototype-basics)に起因)言語仕様のため、TypeScriptの型チェックがなければ引数の過不足に気づきにくい。型注釈をきちんと付けることの実務的な価値がここにある

## 実装例(コード)

```typescript
// thisの挙動の違いを示す例
class Counter {
  count = 0;

  incrementArrow = () => {
    this.count++;
  }; // thisは常にCounterインスタンスを指す
  incrementFunction() {
    this.count++;
  } // 呼び出し方次第でthisが変わりうる
}
```
