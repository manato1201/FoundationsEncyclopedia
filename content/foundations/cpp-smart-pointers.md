---
name: スマートポインタ(unique_ptr/shared_ptr)
category: プログラミング言語
subcategory: C++
masteryBadge: done
summary: RAIIの原則をメモリ管理に適用した、生ポインタのnew/deleteを代替する標準ライブラリの仕組み。
---

## 概要

スマートポインタは、ヒープ上に確保したオブジェクトの所有権と生存期間を自動管理するクラステンプレート。`std::unique_ptr`は単一の所有者のみを許し、`std::shared_ptr`は参照カウントにより複数の所有者を許す。いずれも[RAII](/foundations/cpp-raii)の考え方に基づく。

## 基礎文法

```cpp
#include <memory>

std::unique_ptr<Enemy> enemy = std::make_unique<Enemy>();
// enemyはこのスコープを抜けると自動的に破棄される。コピー不可、ムーブのみ可能

std::shared_ptr<Texture> texture = std::make_shared<Texture>("player.png");
std::shared_ptr<Texture> texture2 = texture; // 参照カウントが2になる
// 両方のshared_ptrがスコープを抜けた時点でTextureが破棄される
```

## つまずきやすい点

- `shared_ptr`同士が循環参照(AがBを、BがAを保持する)すると、参照カウントが0にならず、どちらも解放されないメモリリークになる。循環を断ち切りたい側には`std::weak_ptr`を使う
- `unique_ptr`はコピーできない(コピーコンストラクタが削除されている)。所有権を移動したい場合は`std::move`を使う必要がある
- `shared_ptr`は参照カウントの更新自体にアトミック操作のコストがかかるため、単一の所有者しか必要ない場面で安易に`shared_ptr`を使うと、`unique_ptr`より不必要に遅くなることがある

## 実装例(コード)

```cpp
std::unique_ptr<Enemy> spawnEnemy() {
    auto enemy = std::make_unique<Enemy>();
    return enemy; // ムーブされて呼び出し元へ所有権が移る
}

auto e = spawnEnemy();
```
