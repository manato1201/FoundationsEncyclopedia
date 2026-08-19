---
name: プロトタイプチェーンの基礎
category: プログラミング言語
subcategory: JavaScript
summary: クラス構文の裏側にある、オブジェクト同士が「委譲」でプロパティを共有するJavaScript本来の継承の仕組み。
---

## 概要

JavaScriptのオブジェクトは、内部的に別のオブジェクト(プロトタイプ)への参照を持っており、あるプロパティがそのオブジェクト自身に見つからない場合、プロトタイプを辿って探索する。これをプロトタイプチェーンと呼ぶ。ES2015以降の`class`構文は、この仕組みを読みやすく書くための糖衣構文にすぎない。

## 基礎文法

```javascript
const animal = {
  speak() { console.log(`${this.name}が鳴く`); }
};

const dog = Object.create(animal); // animalをプロトタイプとするオブジェクトを作る
dog.name = "ポチ";
dog.speak(); // "ポチが鳴く" (dog自身にはspeakがないため、プロトタイプのanimalから見つかる)

// class構文は上記と同じ仕組みを別の書き方で表現している
class Animal {
  speak() { console.log(`${this.name}が鳴く`); }
}
```

## つまずきやすい点

- `class`構文に慣れていると、JavaScriptの継承がクラスベースの言語(Java/C#)と同じ仕組みだと誤解しやすいが、実際には全てプロトタイプチェーンによる委譲で実現されている。`class`はその仕組みを隠しているだけ
- プロトタイプチェーンを辿るプロパティ探索にはコストがかかる。チェーンが深くなりすぎると、プロパティアクセスのパフォーマンスに影響することがある
- `Object.prototype`を直接書き換える(モンキーパッチ)と、そのプロトタイプを共有する全てのオブジェクトに影響が及ぶ。特に組み込み型(`Array.prototype`等)への変更は、ライブラリ間の予期しない衝突を招きやすいため避けるべき

## 実装例(コード)

```javascript
// プロトタイプチェーンを直接確認する例
console.log(Object.getPrototypeOf(dog) === animal); // true
console.log(dog.hasOwnProperty("name"));  // true (dog自身のプロパティ)
console.log(dog.hasOwnProperty("speak")); // false (プロトタイプ由来)
```
