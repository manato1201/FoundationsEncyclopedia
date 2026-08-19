---
name: メタテーブルの基礎
category: プログラミング言語
subcategory: Lua
summary: テーブルの標準的な振る舞い(演算子、存在しないキーへのアクセス等)をカスタマイズする仕組み。
---

## 概要

メタテーブルは、あるテーブルに対して「演算子`+`が使われたらどうするか」「存在しないキーにアクセスされたらどうするか」といった特殊な振る舞いを定義するための、別のテーブル。Luaでオブジェクト指向的なクラス・継承を実現する際の土台としても使われる。

## 基礎文法

```lua
local Vector2 = {}
Vector2.__index = Vector2 -- 存在しないキーへのアクセスをVector2自身にフォールバックさせる

function Vector2.new(x, y)
    return setmetatable({ x = x, y = y }, Vector2)
end

function Vector2.__add(a, b) -- +演算子をオーバーロードする
    return Vector2.new(a.x + b.x, a.y + b.y)
end

local v1 = Vector2.new(1, 2)
local v2 = Vector2.new(3, 4)
local v3 = v1 + v2 -- __addが呼ばれる。v3.x == 4, v3.y == 6
```

- `__index`: 存在しないキーへの読み取りアクセスをフォールバックさせる(クラスのメソッド探索の基盤)
- `__add`/`__sub`/`__eq`等: 各種演算子のオーバーロード

## つまずきやすい点

- `__index`にテーブルではなく関数を指定すると、キーが見つからないたびにその関数が呼ばれる(動的な計算プロパティのように使える)。テーブルを指定した場合との挙動の違いを理解していないと、意図しない振る舞いになる
- メタテーブルを多用しすぎると、あるテーブルの実際の振る舞いが「そのテーブル自身の定義」だけでは分からなくなり、メタテーブルの連鎖を追わないと理解できないコードになりがちである
- ゲームエンジンへの組み込みスクリプトとしてLuaを使う場合、メタテーブルを使った継承の実装パターンはエンジン・フレームワークごとに独自の流儀があることが多い。Lua自体の仕様と、利用しているエンジンの流儀を区別して学ぶ必要がある

## 実装例(コード)

```lua
-- 継承の例: EnemyがVector2likeの基本テーブルを継承する
local Base = { greet = function(self) print("Hello from " .. self.name) end }
local Enemy = setmetatable({ name = "Slime" }, { __index = Base })
Enemy:greet() -- "Hello from Slime"
```
