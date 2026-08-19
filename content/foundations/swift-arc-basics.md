---
name: ARC(自動参照カウント)の基礎
category: プログラミング言語
subcategory: Swift
summary: クラスインスタンスの参照数を自動的に数え、0になった時点で解放するSwiftのメモリ管理方式。
---

## 概要

ARC(Automatic Reference Counting)は、Swiftのクラスインスタンス(参照型)のメモリ管理方式。各インスタンスは「いくつの場所から参照されているか」を内部でカウントしており、参照カウントが0になった瞬間に自動的にメモリが解放される。Javaのようなガベージコレクタとは異なり、GCの一時停止(Stop-The-World)が発生しない代わりに、循環参照を自動では解決できない。

## 基礎文法

```swift
class Player {
    let name: String
    init(name: String) { self.name = name }
    deinit { print("\(name)が解放されました") }
}

var p1: Player? = Player(name: "Alice") // 参照カウント1
var p2 = p1                              // 参照カウント2
p1 = nil                                 // 参照カウント1(まだ解放されない)
p2 = nil                                 // 参照カウント0、ここで解放されdeinitが呼ばれる
```

## つまずきやすい点

- 2つのインスタンスが互いを強参照(`strong`、デフォルトの参照)し合うと、参照カウントが決して0にならず、メモリリーク(循環参照)が発生する。片方を`weak`(弱参照、自動的にnilになる)または`unowned`(所有していないが常に存在すると仮定する参照)にすることで断ち切る必要がある
- クロージャは、その中で使われている変数やインスタンスを暗黙的に強参照でキャプチャする。特にクラスの中でクロージャをプロパティとして保持する場合、`self`をキャプチャして循環参照を作りやすい典型パターンになる
- `weak`参照は必ずオプショナル型(`weak var delegate: SomeDelegate?`)である必要がある。参照先が解放されると自動的にnilになるため

## 実装例(コード)

```swift
class ViewController {
    var onComplete: (() -> Void)?

    func setup() {
        // [weak self]でselfへの強参照を避け、循環参照を防ぐ
        onComplete = { [weak self] in
            self?.handleComplete()
        }
    }
}
```
