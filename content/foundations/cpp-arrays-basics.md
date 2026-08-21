---
name: 配列の基礎
category: プログラミング言語
subcategory: C++
masteryBadge: review
summary: C++の生配列はサイズ情報を持たず、ポインタと密接に結びついている。実務ではstd::arrayやstd::vectorが推奨される。
---

## 概要

C++の伝統的な配列(生配列、`int arr[5]`のような形式)は、要素の連続領域を確保するだけで「今何個の要素があるか」という情報を自身では保持しない。配列名は多くの文脈でポインタ(先頭要素へのポインタ)として扱われ、この密接な関係がC++特有の落とし穴を生む。

## 基礎文法

```cpp
int scores[5];                    // 要素数5の生配列(初期化されない)
int fixedScores[3] = {90, 80, 70}; // 初期値付き

scores[0] = 100; // インデックスは0始まり

// C++11以降推奨: 固定長ならstd::array、可変長ならstd::vector
#include <array>
#include <vector>
std::array<int, 5> safeScores{};   // サイズ情報を持つ固定長配列
std::vector<int> dynamicScores;    // 可変長配列
dynamicScores.push_back(100);
```

## つまずきやすい点

- 生配列を関数に渡すと、配列全体ではなく「先頭要素へのポインタ」として渡される(サイズ情報が失われる、「配列の減衰」と呼ばれる現象)。関数側で`sizeof(arr)`のようにサイズを求めようとすると、意図とは異なる値(ポインタ自体のサイズ)が返ってくる典型的な罠がある
- 生配列は範囲外アクセス([境界チェック](/foundations/array-vs-linked-list)の欠如)をコンパイラも実行時も検出してくれないことが多く、未定義動作(不正なメモリアクセス)を引き起こしやすい。`std::array`や`std::vector`の`.at()`メソッドは範囲チェック付きのアクセスを提供し、より安全
- モダンC++(C++11以降)のスタイルガイドの多くは、生配列よりも`std::array`(固定長)・`std::vector`(可変長)の使用を推奨している。[スマートポインタの基礎](/foundations/cpp-smart-pointers)と同じく、「生のC言語由来の機能より、安全性を組み込んだ標準ライブラリの型を使う」という設計思想の一貫

## 実装例(コード)

```cpp
// サイズ情報を失わずに関数へ渡せるstd::vectorの例
void printAll(const std::vector<int>& scores) {
    for (int score : scores) {
        std::cout << score << std::endl;
    }
}
```
