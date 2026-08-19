---
name: structとclassの違い
category: プログラミング言語
subcategory: Swift
summary: Swiftのstructは値型、classは参照型。標準ライブラリの多くの型がstructで実装されている点が特徴的。
---

## 概要

Swiftの`struct`は値型、`class`は参照型で、この区別自体は[C#のstructとclassの違い](/foundations/csharp-struct-vs-class)と同じ考え方。ただしSwiftでは`String`・`Array`・`Dictionary`といった標準ライブラリの基本的な型の多くが`struct`として実装されている点が、他の主流言語と比べて特徴的。

## 基礎文法

```swift
struct PointStruct { var x: Int; var y: Int }
class PointClass { var x: Int; var y: Int; init(x: Int, y: Int) { self.x = x; self.y = y } }

var a = PointStruct(x: 1, y: 1)
var b = a       // 値がコピーされる
b.x = 99        // aには影響しない

let c = PointClass(x: 1, y: 1)
let d = c       // 参照がコピーされる
d.x = 99        // cのxも99になる
```

## つまずきやすい点

- Swiftの`Array`や`Dictionary`は値型だが、実装上はCopy-on-Write(実際に変更が発生するまでは内部でメモリを共有し、コピーを遅延する)という最適化が行われている。値型なのに「コピーしたはずなのに一見コピーされていないように見える」挙動に戸惑うことがある
- `class`のインスタンスを`let`で宣言しても、そのインスタンスのプロパティ自体は(そのプロパティが`var`であれば)変更できる。「`let`だから完全にイミュータブル」という誤解をしやすい(参照先を再代入できないだけで、参照先の中身は変更できる)
- SwiftUIのようなフレームワークでは、値型である`struct`をView(画面)の基本単位として使う設計が推奨される。従来のオブジェクト指向UIフレームワーク(参照型のクラスでViewを表現する)に慣れていると、この設計方針の違いに最初は戸惑うことがある

## 実装例(コード)

```swift
// 値型の性質を活かした、変更のたびに新しい値を作るイミュータブルな設計
struct GameState {
    let score: Int
    let level: Int

    func withScore(_ newScore: Int) -> GameState {
        GameState(score: newScore, level: level)
    }
}
```
