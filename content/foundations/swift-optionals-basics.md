---
name: オプショナル型の基礎
category: プログラミング言語
subcategory: Swift
masteryBadge: done
summary: 「値があるかもしれないし、ないかもしれない」ことを型システムで表現するSwiftの中核機能。
---

## 概要

Swiftのオプショナル型(`Optional<T>`、`T?`と書く)は、「値が存在するか、存在しないか(`nil`)」を型として明示する仕組み。KotlinのNull安全性と同様、値の有無をコンパイラに保証させることで、nilにまつわる実行時エラーを大幅に減らす。

## 基礎文法

```swift
var nickname: String? = nil // オプショナル: nilを許容する
var name: String = "Player" // 非オプショナル: nilを代入できない

// オプショナルバインディング(if let): nilでなければ中身を取り出して使う
if let nickname = nickname {
    print("ニックネーム: \(nickname)")
} else {
    print("ニックネーム未設定")
}

// nil合体演算子: nilの場合のデフォルト値を指定
let displayName = nickname ?? "名無し"
```

## つまずきやすい点

- `!`(強制アンラップ)は、オプショナルを「絶対にnilではない」と決めつけて中身を取り出す。実際にnilだった場合は実行時クラッシュになるため、確信が持てる場面(Interface Builder経由の`@IBOutlet`等の特殊な文脈)以外では避けるべき
- `guard let`は「nilならこの関数から早期returnする」というガード節のパターンで頻出する。`if let`とは異なり、アンラップした値をその後のスコープ全体で使い続けられる点が特徴
- オプショナルの連鎖(`a?.b?.c`)は途中のどこか1つでもnilなら全体がnilになる。エラーの発生箇所を特定しにくくなることがあるため、複雑な連鎖は分割して書いた方がデバッグしやすい

## 実装例(コード)

```swift
func greet(name: String?) {
    guard let name = name else {
        print("名前が指定されていません")
        return
    }
    print("こんにちは、\(name)さん") // ここではnameは非オプショナルとして使える
}
```
