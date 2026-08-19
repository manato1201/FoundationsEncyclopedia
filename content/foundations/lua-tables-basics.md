---
name: テーブルの基礎
category: プログラミング言語
subcategory: Lua
masteryBadge: done
summary: 配列にも連想配列にもなる、Lua唯一のデータ構造。この単純さがゲームエンジン組み込みに向く理由の1つ。
---

## 概要

Luaには配列・連想配列・構造体・オブジェクトといった区別がなく、これら全てを「テーブル(table)」という単一のデータ構造で表現する。数値インデックスでアクセスすれば配列のように、文字列キーでアクセスすれば連想配列のように振る舞う。

## 基礎文法

```lua
local list = {"Sort", "Search", "Tree"} -- 配列のように使う(インデックスは1始まり)
print(list[1]) -- "Sort"

local player = { name = "Alice", hp = 100 } -- 連想配列のように使う
print(player.name) -- "Alice" (player["name"]と同義)

for i, value in ipairs(list) do
    print(i, value) -- 配列部分を順番に走査
end

for key, value in pairs(player) do
    print(key, value) -- 全てのキーを走査(順序は保証されない)
end
```

## つまずきやすい点

- Luaの配列インデックスは0ではなく1から始まる。他の多くの言語(C系統)から来た開発者が最も頻繁につまずくポイントの1つ
- `ipairs`は「1から始まる連続した数値キー」の部分だけを順番通りに走査するのに対し、`pairs`は数値キー・文字列キーを含む全要素を走査するが順序は保証されない。この違いを理解せずに使うと、意図しない要素が抜け落ちる・順序が入れ替わるといった問題が起きる
- テーブルの途中の要素に`nil`を代入すると、そこから先が「配列」として認識されなくなることがある(`#`演算子で取得できる長さが不定になる)。要素を削除したい場合は、詰め直すか別の方法を検討する必要がある

## 実装例(コード)

```lua
-- テーブルをオブジェクトのように使う(クラスのようなものを模倣する)
local Enemy = {}
Enemy.__index = Enemy

function Enemy.new(name, hp)
    local self = setmetatable({}, Enemy)
    self.name, self.hp = name, hp
    return self
end
```
