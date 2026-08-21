---
name: 自作関数の基礎
category: プログラミング言語
subcategory: C++
masteryBadge: done
summary: C++の関数は戻り値の型・引数の型を明示する。値渡し・参照渡し・ポインタ渡しの3通りの引数の渡し方がある。
---

## 概要

C++の関数定義は戻り値の型・関数名・引数リストを明示する静的型付けの文法を持つ点はC#と共通するが、引数の渡し方に「値渡し」「参照渡し」「ポインタ渡し」という3つの選択肢があり、それぞれコピーの有無や呼び出し元への影響が異なる。

## 基礎文法

```cpp
// 値渡し: 引数のコピーが渡される。関数内での変更は呼び出し元に影響しない
int add(int a, int b) {
    return a + b;
}

// 参照渡し: 呼び出し元の変数そのものを扱う。コピーが発生しない
void increment(int& value) {
    value += 1;
}

// ポインタ渡し: アドレスを渡す。nullを渡せる点が参照と異なる
void incrementPtr(int* value) {
    if (value != nullptr) {
        *value += 1;
    }
}
```

## つまずきやすい点

- 大きな構造体やクラスを値渡しにすると、呼び出しのたびにコピーのコストが発生する。変更が不要なら`const T&`(const参照)で受け取るのが、コピーを避けつつ意図しない変更も防げる定石(この考え方は[const正しさの基礎](/foundations/cpp-const-correctness)にも通じる)
- 参照渡しとポインタ渡しはどちらも「呼び出し元に変更を反映できる」という点で似ているが、参照は必ず有効な値を指す(nullを表現できない)のに対し、ポインタはnullを取りうる。「値が存在しないかもしれない」ことを表現したい場合はポインタ(または`std::optional`)を使う
- 関数のデフォルト引数は宣言(ヘッダファイル)側にのみ書く。[ヘッダファイルとソースファイルの分離](/foundations/cpp-header-vs-source)の慣習に沿って定義側にもデフォルト値を書いてしまうと、コンパイルエラーになる

## 実装例(コード)

```cpp
// デフォルト引数の宣言(ヘッダ側)
void takeDamage(int amount, bool isCritical = false);

// 実装側(ソース)にはデフォルト値を書かない
void takeDamage(int amount, bool isCritical) {
    // ...
}
```
