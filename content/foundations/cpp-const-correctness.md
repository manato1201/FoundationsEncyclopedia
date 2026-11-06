---
name: const正しさ(const correctness)
category: プログラミング言語
subcategory: C++
summary: 「変更しない」という意図を型システムで表明し、コンパイラに保証させる設計習慣。
operationSteps:
  - label: "変更しない値にconstを付ける"
    note: "変えるつもりのない変数や引数に、constを付ける"
  - label: "参照渡しでコピーを避ける"
    note: "大きなオブジェクトは、const参照で受け取る"
  - label: "メンバ関数をconstにする"
    note: "オブジェクトの状態を変えない関数に、constを付ける"
  - label: "コンパイラが違反を検出する"
    note: "constの値を書き換えようとすると、コンパイルエラーになる"
  - label: "意図が型に表れる"
    note: "読む人が、変更されるかどうかを、型から判断できる"
---

## 概要

const正しさとは、変更されるべきでないデータやメソッドに`const`を一貫して付ける設計習慣のこと。単なるスタイルの問題ではなく、`const`を付けることでコンパイラが「意図しない変更」をコンパイルエラーとして検出できるようになる。

## 基礎文法

```cpp
class Player {
public:
    int getHp() const { return hp_; } // constメソッド: メンバー変数を変更しない
    void takeDamage(int amount) { hp_ -= amount; } // 非constメソッド: 変更する

private:
    int hp_;
};

void printHp(const Player& player) { // const参照: playerを変更しないという契約
    std::cout << player.getHp(); // constメソッドしか呼べない
}
```

## つまずきやすい点

- `const`メソッドの中から非`const`メソッドを呼ぶとコンパイルエラーになる。「このメソッドは本当にオブジェクトを変更しないか」を機械的に検証してくれる一方、後から`const`を付け忘れたメソッドが混在すると連鎖的に修正が必要になることがある
- ポインタの`const`には「ポインタ自体がconst」と「指し先がconst」の2種類があり、`const int* p`(指し先がconst)と`int* const p`(ポインタ自体がconst)は意味が異なる。この読み方の違いはC++初学者がつまずきやすい典型例
- 大きなオブジェクトを関数に渡す際、`const T&`(const参照)ではなく値渡しにしてしまうと、意図せずコピーが発生しパフォーマンスに影響する

## 実装例(コード)

```cpp
// 引数はconst参照で受け取り不要なコピーを避け、戻り値もconstにして誤った代入を防ぐ
const std::string& getName() const { return name_; }
```
