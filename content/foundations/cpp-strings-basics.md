---
name: 文字列とchar配列の基礎
category: プログラミング言語
subcategory: C++
masteryBadge: review
summary: C++にはC言語由来のchar配列(Cスタイル文字列)と、より安全なstd::stringの2つの文字列表現がある。
---

## 概要

C++は、C言語から受け継いだ「ヌル終端されたchar配列」(Cスタイル文字列)と、C++標準ライブラリの`std::string`という2つの文字列表現を持つ。`std::string`はサイズ管理・メモリ管理を自動化しており、現代のC++コードでは基本的にこちらを使うのが推奨される。

## 基礎文法

```cpp
// Cスタイル文字列: char配列 + ヌル終端('\0')
char cStyle[] = "Hello"; // 実際には'H','e','l','l','o','\0'の6要素

// std::string: サイズ管理を自動化した安全な文字列型
#include <string>
std::string modern = "Hello";
modern += ", World!"; // 動的にサイズが変化する
size_t len = modern.length();
char firstChar = modern[0];
```

## つまずきやすい点

- Cスタイル文字列は「ヌル終端('\0')」で文字列の終わりを判断する。この終端文字を書き込む領域を確保し忘れると、文字列処理関数(`strlen`等)が配列の境界を超えて読み進めてしまい、未定義動作([配列の基礎](/foundations/cpp-arrays-basics)で触れた範囲外アクセス問題)を引き起こす典型的な脆弱性の原因になる
- `std::string`同士の連結や比較は演算子(`+`、`==`)で直感的に書けるが、Cスタイル文字列の比較に`==`を使うと、文字列の中身ではなくポインタ(アドレス)の比較になってしまう([ポインタの基礎](/foundations/cpp-pointers-basics)参照)。文字列の中身を比較したい場合は`strcmp`関数を使う必要がある
- `std::string`は内部でヒープメモリを確保することが多く、頻繁な連結操作([文字列とchar配列の基礎(C#)](/foundations/csharp-strings-basics)の`StringBuilder`と同様の課題)はパフォーマンスに影響しうる。`reserve()`で事前に容量を確保しておくと、再確保の回数を減らせる

## 実装例(コード)

```cpp
// Cスタイル文字列の比較の罠
const char* a = "hello";
const char* b = "hello";
// if (a == b) は未定義(多くの場合falseになりうる、ポインタの比較)
if (strcmp(a, b) == 0) { // 正しくは中身を比較するstrcmpを使う
    std::cout << "同じ内容です" << std::endl;
}
```
