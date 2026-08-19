---
name: ヘッダファイルとソースファイルの分離
category: プログラミング言語
subcategory: C++
summary: 宣言(.h)と実装(.cpp)を分けるC++の伝統的なファイル構成と、その意図。
---

## 概要

C++では、クラスや関数の「宣言」をヘッダファイル(`.h`/`.hpp`)に、「実装」をソースファイル(`.cpp`)に分けて書くのが伝統的な構成。他のファイルから利用する側は、実装の詳細を知らなくてもヘッダをインクルードするだけで宣言(インターフェース)を参照できる。

## 基礎文法

```cpp
// Player.h(宣言)
class Player {
public:
    void takeDamage(int amount);
private:
    int hp_ = 100;
};

// Player.cpp(実装)
#include "Player.h"

void Player::takeDamage(int amount) {
    hp_ -= amount;
}
```

- `#include`は基本的に「ファイルの中身をその場に貼り付ける」プリプロセッサ命令。同じヘッダが複数箇所からインクルードされて二重定義エラーになるのを防ぐため、インクルードガード(`#ifndef`/`#define`または`#pragma once`)を使う

## つまずきやすい点

- ヘッダファイルに実装まで書いてしまうと、そのヘッダをインクルードした全ての`.cpp`ファイルで同じコードが重複コンパイルされ、ビルド時間が伸びる原因になる(テンプレートは例外的にヘッダに実装を書く必要がある、[テンプレートの基礎](/foundations/cpp-templates-basics)参照)
- インクルードガードを書き忘れると、同じヘッダが1つの翻訳単位に複数回展開され「クラスの再定義」エラーになる
- ヘッダ同士が互いをインクルードし合う循環依存が発生すると、コンパイルが通らなくなる。前方宣言(`class Player;`)で実体の詳細を必要としない箇所の依存を減らすのが定石

## 実装例(コード)

```cpp
#ifndef PLAYER_H
#define PLAYER_H

class Player { /* ... */ };

#endif // PLAYER_H
```
