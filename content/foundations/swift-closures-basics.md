---
name: クロージャの基礎
category: プログラミング言語
subcategory: Swift
masteryBadge: review
summary: 周囲の変数を捕捉できる、名前を持たない自己完結型の関数ブロック。
---

## 概要

クロージャは、名前を持たない関数リテラルで、定義された場所の周囲の変数や定数を「捕捉(キャプチャ)」できる。SwiftUIのボタンのアクションやアニメーションの完了ハンドラなど、コールバックとして頻繁に使われる。

## 基礎文法

```swift
let multiplier = 3
let triple: (Int) -> Int = { value in
    value * multiplier // 周囲のmultiplierを捕捉して使っている
}
print(triple(5)) // 15

// 末尾クロージャ構文: 最後の引数がクロージャの場合、括弧の外に書ける
UIView.animate(withDuration: 0.3) {
    self.view.alpha = 0
}
```

## つまずきやすい点

- クロージャは変数を「値」ではなく「参照」として捕捉することが多い(特に`var`)。クロージャが実行されるタイミングでの最新の値が使われるため、「定義した時点の値がそのまま使われる」という思い込みでバグを作りやすい
- クラスのインスタンスメソッドの中でクロージャに`self`を渡すと、[ARC](/foundations/swift-arc-basics)の項で触れた循環参照の原因になりうる。長期間保持されるクロージャ(プロパティとして保持されるハンドラ等)では`[weak self]`の使用を検討する必要がある
- `@escaping`修飾子が必要な場面(クロージャが関数の実行終了後も生き続ける、非同期処理のコールバック等)を忘れると、コンパイルエラーになる。逆にこの修飾子の意味を理解していないと、なぜ必要なのか分かりにくい

## 実装例(コード)

```swift
func fetchData(completion: @escaping (Result<Data, Error>) -> Void) {
    URLSession.shared.dataTask(with: url) { data, _, error in
        // このクロージャはfetchDataの実行終了後に非同期に呼ばれるため@escapingが必要
        if let data = data {
            completion(.success(data))
        }
    }.resume()
}
```
