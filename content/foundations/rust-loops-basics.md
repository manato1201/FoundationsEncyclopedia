---
name: for/while/loopの基礎
category: プログラミング言語
subcategory: Rust
masteryBadge: review
summary: Rustはfor/whileに加え、無限ループ専用のloopキーワードを持ち、breakで値を返せるという独自の機能がある。
---

## 概要

Rustは[C#](/foundations/csharp-loops-basics)と同様に`for`・`while`を持つが、さらに「無限ループ専用」の`loop`というキーワードを持つ点が特徴的。しかも`loop`は`break`に値を渡すことで、ループ全体を「式」として評価できる、他の多くの言語にはない性質を持つ。

## 基礎文法

```rust
// for: イテレータを順に処理する(Pythonのforに近い発想)
let scores = vec![90, 80, 70];
for score in &scores {
    println!("{}", score);
}

for i in 0..5 { // 範囲(Range)を使った回数指定の繰り返し
    println!("{}", i);
}

// while: 条件が満たされる間繰り返す
let mut hp = 100;
while hp > 0 {
    hp -= 10;
}

// loop: 無限ループ専用。breakに値を渡すとループ全体の戻り値になる
let mut counter = 0;
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2; // ここでloop式全体の値が確定する
    }
};
```

## つまずきやすい点

- `loop`が「式」として値を返せるという性質は、[C#](/foundations/csharp-loops-basics)や[C++](/foundations/cpp-loops-basics)の`while (true) { ... }`にはない発想。「ループの結果を直接変数に代入する」という書き方に慣れていないと、なぜわざわざ`loop`というキーワードが独立して存在するのか理解しにくい
- `for score in &scores`のように、コレクションを借用(`&`、[借用とライフタイム](/foundations/rust-borrowing-basics)参照)して走査するのが基本。`&`を付けずに`for score in scores`と書くと、[所有権の基礎](/foundations/rust-ownership-basics)で触れた「ムーブ」が発生し、そのコレクションはループの後で使えなくなる
- Rustの範囲(`0..5`)は「0以上5未満」を表す。C系言語の`for (i = 0; i < 5; i++)`と実質同じ範囲だが、`0..=5`(0以上5以下)という「終端を含む」別の記法も存在し、混同しやすい

## 実装例(コード)

```rust
// ラベル付きloopで多重ループから一気に抜ける例(Javaのラベル付きbreakに近い)
'outer: for i in 0..5 {
    for j in 0..5 {
        if i * j > 6 {
            break 'outer;
        }
    }
}
```
