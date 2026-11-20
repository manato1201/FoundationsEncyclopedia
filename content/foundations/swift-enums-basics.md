---
name: "列挙型(enum)の基礎"
category: プログラミング言語
subcategory: "Swift"
summary: "Swiftの enum は、取りうる場合を列挙し、場合ごとに値(関連値)も持てる。switch で全ての場合を扱う。"
claim: "enum は「取りうる場合の一覧」。switch は、全ての場合を書かないとコンパイルが通らない。"
operationSteps:
  - label: "場合(case)を列挙する"
    note: "`enum Direction { case north, south }` のように、取りうる値だけを定義する"
  - label: "値を持たせる(関連値)"
    note: "`case circle(radius: Double)` のように、場合ごとに、別の種類の値を付けられる"
  - label: "switchで分岐する"
    note: "`switch shape { case .circle(let r): ... }` で、場合ごとの処理を書き、中身を取り出す"
  - label: "全ての場合が必要"
    note: "case を1つでも書き漏らすと、コンパイルエラー(default で受けることもできる)"
  - label: "rawValueで対応させる"
    note: "`enum Level: Int` のように型を付けると、各caseに整数などを割り当て、`rawValue` で取り出せる"
quiz:
  - question: "switch で enum の case を1つ書き漏らし、default もないとどうなるか"
    choices:
      - "コンパイルエラーになる"
      - "実行時にだけ警告が出る"
      - "何も起きない"
    answer: 0
    explanation: "Swiftのswitchは網羅的であることが求められる。書き漏らしを、実行前に発見できる。"
---

## 概要

Swiftの**enum**(列挙型)は、「取りうる場合が決まっているもの」を表す型。方角・状態・結果の種類などに使う。他の言語のenumより機能が多く、場合ごとに値(**関連値**)を付けたり、メソッドを持たせたりできる。`switch`と組み合わせると、場合の扱い漏れを、コンパイラが見つけてくれる。

## 基礎文法

```swift
enum Shape {
    case circle(radius: Double)
    case rect(width: Double, height: Double)
}

func area(_ shape: Shape) -> Double {
    switch shape {
    case .circle(let r):
        return Double.pi * r * r
    case .rect(let w, let h):
        return w * h
    }
}
```

- 関連値のない enum は、自動で`Equatable`になる(`==`で比べられる)
- `enum Level: Int`のように型を指定すると、`rawValue`で元の値、`Level(rawValue: 2)`で逆引きができる(逆引きは`Optional`が返る)
- `CaseIterable`に準拠すると、`Level.allCases`で全caseを列挙できる
- `Optional`も、実は enum(`.some`と`.none`)。[オプショナル型の基礎](/foundations/swift-optionals-basics)を参照

## つまずきやすい点

- 後から case を追加すると、`default`を書いていない`switch`は、すべてコンパイルエラーになる。これは、扱い漏れを見つけるための挙動
- `default`を安易に書くと、追加された case を黙って`default`が受けてしまい、漏れに気づけなくなる
- 関連値は、case ごとに型が違ってよい。取り出すには`let`でパターンに束縛する
- `rawValue`は、すべての case で一意でなければならない。整数型で値を省略すると、前の値に1を足した値が、自動で割り当てられる

## 実装例(コード)

```swift
enum Shape {
    case circle(radius: Double)
    case rect(width: Double, height: Double)
}

func area(_ shape: Shape) -> Double {
    switch shape {
    case .circle(let r): return Double.pi * r * r
    case .rect(let w, let h): return w * h
    }
}

enum Level: Int, CaseIterable { case easy = 1, normal, hard }

print(area(.rect(width: 2, height: 3)))   // 6.0
print(Level.hard.rawValue)                // 3(normal は 2 が自動で付く)
print(Level(rawValue: 2) == .normal)      // true
print(Level.allCases.count)               // 3
```
