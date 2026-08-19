---
name: テンプレートの基礎
category: プログラミング言語
subcategory: C++
masteryBadge: review
summary: 型をパラメータ化してコンパイル時に具体化する、C++のジェネリックプログラミングの中核機能。
---

## 概要

テンプレートは、関数やクラスが扱う型をパラメータ化する仕組み。呼び出し時に指定された型ごとに、コンパイラがコードを生成する(テンプレートの実体化)。C++標準ライブラリの`std::vector<T>`や`std::sort`は全てテンプレートで実装されている。

## 基礎文法

```cpp
template <typename T>
T maxValue(T a, T b) {
    return (a > b) ? a : b;
}

int i = maxValue(3, 7);         // T = int で実体化
double d = maxValue(1.5, 2.5);  // T = double で実体化
```

## つまずきやすい点

- テンプレートは呼び出された型ごとにコードが生成される(コード膨張)。多数の型で同じテンプレートを使うと、実行ファイルのサイズが想定以上に増えることがある
- テンプレートのエラーメッセージは、実体化された箇所まで遡って表示されるため長大で読みにくくなりがち。C++20の`concept`は、テンプレート引数に満たすべき条件を明示することでこの問題を緩和する
- テンプレートの定義は原則としてヘッダファイルに書く必要がある(実体化のタイミングでコンパイラが定義全体を必要とするため)。通常の関数のようにヘッダ(宣言)とソース(実装)を分離する慣習とは異なる点に注意

## 実装例(コード)

```cpp
template <typename T>
class Stack {
public:
    void push(const T& value) { data_.push_back(value); }
    T pop() {
        T value = data_.back();
        data_.pop_back();
        return value;
    }
private:
    std::vector<T> data_;
};
```
