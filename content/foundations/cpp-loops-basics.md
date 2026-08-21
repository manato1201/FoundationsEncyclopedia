---
name: for/whileループの基礎
category: プログラミング言語
subcategory: C++
masteryBadge: done
summary: C++はC言語由来のfor/while/do-whileに加え、範囲ベースfor文(range-based for)を持つ。
---

## 概要

C++は伝統的な`for`・`while`・`do-while`に加え、C++11以降は「範囲ベースfor文」という、コレクションの各要素を簡潔に走査できる構文を持つ。[forループの実行フロー](/foundations/for-loop-flow)で扱った基本構造そのままの`for`文と、コレクション向けの範囲ベースfor文を使い分ける。

## 基礎文法

```cpp
// 伝統的なfor: インデックスを明示的に管理する
for (int i = 0; i < 5; i++) {
    std::cout << i << std::endl;
}

// while: 条件が満たされる間繰り返す
int hp = 100;
while (hp > 0) {
    hp -= 10;
}

// 範囲ベースfor: コレクションの各要素を順に処理する(C++11以降)
std::vector<int> scores = {90, 80, 70};
for (int score : scores) {
    std::cout << score << std::endl;
}

// 参照で受け取ればコピーを避けられる
for (const auto& score : scores) {
    std::cout << score << std::endl;
}
```

## つまずきやすい点

- 範囲ベースfor文で要素を値渡し(`for (int score : scores)`)にすると、各要素がコピーされる。大きなオブジェクトのコレクションを走査する場合、`const auto&`(参照)で受け取らないと不必要なコピーコストがかかる
- `for`文の3つの部分(初期化、条件、更新)のいずれかを省略できるが、全て省略した`for (;;)`は無限ループになる。意図的な無限ループなのか、書き忘れなのかがコードから読み取りにくくなることがある
- 範囲ベースfor文で走査中にコレクション自体へ要素を追加・削除すると、[イテレータ](https://en.cppreference.com/w/cpp/iterator)が無効化され、未定義動作を引き起こすことがある。走査中の変更は避けるべき

## 実装例(コード)

```cpp
// インデックスが必要な場合は伝統的なforを使う
std::vector<std::string> items = {"Sort", "Search", "Tree"};
for (size_t i = 0; i < items.size(); i++) {
    std::cout << i << ": " << items[i] << std::endl;
}
```
