---
name: RAII(リソース確保は初期化)
category: プログラミング言語
subcategory: C++
masteryBadge: review
summary: オブジェクトの生存期間にリソース管理を結びつけるC++の中核イディオム。スマートポインタの基盤でもある。
---

## 概要

RAII(Resource Acquisition Is Initialization)は、メモリ・ファイルハンドル・ロックなどのリソース確保をオブジェクトの構築(コンストラクタ)に、解放を破棄(デストラクタ)に結びつける設計イディオム。スコープを抜ける際にデストラクタが自動的に呼ばれることを利用し、例外が発生した場合でも確実にリソースを解放できる。

## 基礎文法

```cpp
class FileHandle {
public:
    explicit FileHandle(const char* path) : file_(std::fopen(path, "r")) {}
    ~FileHandle() { if (file_) std::fclose(file_); }
private:
    std::FILE* file_;
};

void readSomething() {
    FileHandle handle("data.txt"); // ここで確保
    // ... 処理中に例外が飛んでも handle のデストラクタは必ず呼ばれる
} // スコープを抜けると自動的に解放
```

## つまずきやすい点

- コピーコンストラクタ/コピー代入演算子を適切に定義(または禁止)しないと、同じリソースを2つのオブジェクトが「所有」してしまい二重解放が起きる
- `std::unique_ptr`/`std::shared_ptr`はRAIIをメモリ管理に適用した標準ライブラリの実装であり、生ポインタの`new`/`delete`を素で書く必要はほとんどない
- デストラクタから例外を投げてはならない(スタック巻き戻し中に別の例外が飛ぶとプログラムが即座に終了する)

## 実装例(コード)

```cpp
#include <memory>

void useResource() {
    std::unique_ptr<Widget> widget = std::make_unique<Widget>();
    widget->doSomething();
} // widgetのデストラクタが自動的に呼ばれ、Widgetのメモリが解放される
```
