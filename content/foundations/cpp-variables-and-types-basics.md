---
name: 変数宣言と型の基礎
category: プログラミング言語
subcategory: C++
masteryBadge: done
summary: C++は静的型付けで、変数は宣言時に型とメモリ領域が確定する。型のサイズを明確に意識する必要がある言語。
---

## 概要

C++の変数は、宣言された型に応じたサイズのメモリ領域がその場で確保される、静的型付け言語。C#やJavaのようなマネージド言語と異なりガベージコレクションを持たないため、変数がどこにどれだけのメモリを占めるかを意識する場面が多い。

## 基礎文法

```cpp
int score = 100;         // 4バイト程度の整数
double health = 99.5;    // 8バイト程度の浮動小数点数
bool isActive = true;
char grade = 'A';        // 1文字(1バイト)

const int MaxHp = 100;   // 再代入不可
auto count = 10;         // 型推論(C++11以降)。コンパイル時にintと確定する
```

- `auto`はC#の`var`と同様、型推論であって動的型付けではない
- 整数型には`int`/`short`/`long`/`long long`のようにサイズの異なる複数の種類があり、扱う値の範囲に応じて選ぶ

## つまずきやすい点

- C++の整数型のサイズ(`int`が何バイトか等)は、C#やJavaのように言語仕様で完全に固定されているわけではなく、プラットフォーム・コンパイラによって変わりうる。移植性が重要な場面では`int32_t`のようなサイズが保証された型([<cstdint>](https://en.cppreference.com/w/cpp/header/cstdint)由来)を使うのが安全
- ローカル変数を初期化せずに使うと、[未定義動作](https://en.cppreference.com/w/cpp/language/ub)(不定な値が入っている)になる。C#やJavaのようにコンパイラがデフォルト値で初期化してくれる保証はなく、明示的な初期化が実務上のルールとして重要
- `const`は変数だけでなく、ポインタの指し先やメンバー関数にも付けられる([const正しさの基礎](/foundations/cpp-const-correctness)参照)。「何にconstが付いているか」を正確に読み取る訓練が必要になる

## 実装例(コード)

```cpp
#include <cstdint>

int32_t score = 100;     // サイズが保証された32ビット整数
uint8_t hp = 255;         // 符号なし8ビット整数(0〜255)
```
