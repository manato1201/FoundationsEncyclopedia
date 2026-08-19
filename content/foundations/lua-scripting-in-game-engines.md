---
name: ゲームエンジンでのLua組み込みスクリプティング
category: プログラミング言語
subcategory: Lua
summary: 軽量・高速・組み込みやすいという特性から、多くのゲームエンジンでスクリプト言語として採用されてきた背景。
---

## 概要

Luaは、C言語で実装されたインタプリタが非常に軽量かつ高速で、ホストとなるアプリケーション(C/C++で書かれたゲームエンジン本体)に組み込みやすい設計を持つ。この特性から、World of WarcraftのUIスクリプト、Roblox、多くの独自ゲームエンジンでスクリプト言語として採用されてきた。

## 基礎文法

C++側からLuaスクリプトを実行する典型的な流れ:

```cpp
lua_State* L = luaL_newstate();
luaL_openlibs(L); // 標準ライブラリを読み込む

// C++の関数をLuaから呼べるように登録する
lua_register(L, "spawnEnemy", lua_spawnEnemy);

luaL_dofile(L, "script.lua"); // Luaスクリプトを実行
```

```lua
-- script.lua側からC++側の関数を呼び出せる
spawnEnemy("Slime", 10, 10)
```

## つまずきやすい点

- LuaとC++の間で値を受け渡す際、Luaのスタックベースの呼び出し規約(`lua_pushnumber`、`lua_tostring`等)に沿ってデータを積み下ろしする必要があり、C++側のバインディングコードが煩雑になりがち。`sol2`のようなバインディングライブラリを使うと、この定型作業を大幅に減らせる
- スクリプト側で無限ループや非常に重い処理を書かれると、ゲーム全体がフリーズする。実行ステップ数の上限を設ける、[コルーチン](/foundations/lua-coroutines-basics)で処理を分割するなど、スクリプト側の暴走を防ぐ設計が必要になる
- C++側のオブジェクトのライフタイム(いつ破棄されるか)と、Lua側がそのオブジェクトへの参照をいつまで保持するかの管理を誤ると、Lua側が既に破棄されたC++オブジェクトを参照してクラッシュする「ダングリング参照」の問題が起きやすい

## 実装例(コード)

```cpp
// sol2ライブラリを使った簡潔なバインディング例
sol::state lua;
lua.open_libraries(sol::lib::base);
lua.set_function("spawnEnemy", [](std::string name, int x, int y) {
    // C++側のロジック
});
```
