---
name: 変数宣言と型の基礎
category: プログラミング言語
subcategory: TypeScript
masteryBadge: done
summary: JavaScriptに型注釈を追加した言語。let/constという変数宣言はJS由来、型の部分がTypeScript独自。
---

## 概要

TypeScriptは、JavaScriptの変数宣言(`let`/`const`)の文法をそのまま引き継ぎつつ、そこに型注釈を追加できるようにした言語。[C#の変数宣言](/foundations/csharp-variables-and-types-basics)と似た静的型付けの恩恵を受けられるが、実行時には型情報が全て消去され(型消去)、最終的にJavaScriptとして実行される点が異なる。

## 基礎文法

```typescript
let score: number = 100; // 型注釈は省略も可能(型推論が働く)
let name = "Player"; // 型注釈なしでもstring型と推論される
const isActive: boolean = true; // constは再代入不可

let count: number; // 宣言だけして後で代入することも可能
count = 10;
```

- `let`: 再代入可能な変数
- `const`: 再代入不可能な変数(オブジェクトの中身自体は変更可能な点に注意)
- 古い`var`はスコープの挙動に問題があり([クロージャの基礎(JavaScript)](/foundations/javascript-closures-basics)参照)、現在は`let`/`const`の使用が推奨される

## つまずきやすい点

- `const`で宣言したオブジェクトや配列は、「変数の再代入」ができないだけで、中身(プロパティや要素)は変更できる。`const obj = {}; obj.x = 1;`はエラーにならない、という点をC#の`readonly`と混同しやすい
- TypeScriptの型チェックはあくまでコンパイル時(正確にはトランスパイル時)のものであり、実行時には型情報が完全に消去される。実行時に外部から来たデータ(API応答等)の型を保証するものではなく、[型の絞り込み(Type Narrowing)](/foundations/typescript-type-narrowing)のような実行時チェックと組み合わせる必要がある
- `any`型は事実上「型チェックを放棄する」型であり、多用すると[strictモード](/foundations/typescript-strict-mode)を有効にしていても型安全性の恩恵が失われる

## 実装例(コード)

```typescript
// 型注釈なしでも型推論が働くことを確認する例
let items = ["Sort", "Search"]; // string[] と推論される
items.push("Tree"); // OK
// items.push(42);                // エラー: numberはstringに割り当てられない
```
