---
name: プロトコル指向プログラミング
category: プログラミング言語
subcategory: Swift
masteryBadge: advanced
summary: 継承よりもプロトコル(インターフェース)の組み合わせを優先する、Swiftコミュニティで重視される設計思想。
---

## 概要

プロトコル指向プログラミング(POP)は、Appleが提唱したSwiftの設計思想で、クラス継承による機能の共有よりも、プロトコル(他言語のインターフェースに相当)とプロトコル拡張(デフォルト実装)の組み合わせを優先するアプローチ。単一継承の制約を避けつつ、`struct`にも共通の振る舞いを持たせられる。

## 基礎文法

```swift
protocol Describable {
    func describe() -> String
}

// プロトコル拡張: デフォルト実装を提供する(実装していない型は自動的にこれが使われる)
extension Describable {
    func describe() -> String {
        "説明なし"
    }
}

struct Enemy: Describable {
    let name: String
    func describe() -> String { "敵: \(name)" } // デフォルト実装を上書き
}

struct Item: Describable {
    let name: String
    // describe()を定義しなければ、プロトコル拡張のデフォルト実装が使われる
}
```

## つまずきやすい点

- `class`と違い、`struct`は継承できないが、プロトコルへの準拠(conformance)はいくつでも可能。「継承の代わりにプロトコルを組み合わせる」という発想への転換が、オブジェクト指向言語出身者にとって最初のハードルになりやすい
- プロトコル拡張のデフォルト実装は、静的ディスパッチ(コンパイル時に呼び出し先が決まる)で解決される。プロトコル型の変数経由で呼んだ場合と具体的な型経由で呼んだ場合とで、意図せず異なる実装が呼ばれることがある(オーバーライドと勘違いしやすい罠)
- 何でもかんでもプロトコルで抽象化しようとすると、小さな型が大量のプロトコルに準拠する複雑な構造になりがち。本当に複数の型で共有する振る舞いがあるときに導入するのが現実的

## 実装例(コード)

```swift
protocol Damageable {
    var hp: Int { get set }
    mutating func takeDamage(_ amount: Int)
}

extension Damageable {
    mutating func takeDamage(_ amount: Int) {
        hp = max(0, hp - amount)
    }
}
```
