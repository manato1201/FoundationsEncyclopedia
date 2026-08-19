---
name: コルーチンの基礎
category: プログラミング言語
subcategory: Lua
masteryBadge: review
summary: 明示的に中断・再開できる協調的な並行処理単位。ゲームのシーケンス制御によく使われる。
---

## 概要

Luaのコルーチンは、`coroutine.yield`で明示的に実行を中断し、`coroutine.resume`で再開できる協調的な(cooperative)並行処理の仕組み。OSスレッドのようにいつでも横取りされる(プリエンプティブ)ものではなく、コルーチン自身が`yield`を呼ぶまでは制御を手放さない。

## 基礎文法

```lua
local function sequence()
    print("ステップ1")
    coroutine.yield() -- ここで一時停止し、呼び出し元に制御を返す
    print("ステップ2")
    coroutine.yield()
    print("ステップ3")
end

local co = coroutine.create(sequence)
coroutine.resume(co) -- "ステップ1" が出力され、yieldで停止
coroutine.resume(co) -- "ステップ2" が出力され、yieldで停止
coroutine.resume(co) -- "ステップ3" が出力され、コルーチンは終了
```

## つまずきやすい点

- コルーチンは真の並列実行ではない。あくまで「1つの処理が実行中に自発的に中断・再開する」仕組みであり、複数のCPUコアを同時に使うわけではない。マルチスレッドと混同すると設計を誤る
- `coroutine.resume`は成功したかどうかを示す真偽値とエラーメッセージを返す。エラーが発生した場合、`error()`のように即座にプログラム全体を止めるのではなく、`resume`の戻り値としてエラーが返ってくる点が通常の関数呼び出しと異なる
- ゲームエンジンでは、コルーチンを「毎フレームの更新の中で少しずつ処理を進める」演出制御(会話イベントの逐次進行、カットシーンの制御等)に使うことが多い。フレーム更新のループと`resume`の呼び出しタイミングの関係を正しく設計しないと、意図した速度でシーケンスが進まない

## 実装例(コード)

```lua
-- フレームごとに少しずつ進行させる典型パターン
local co = coroutine.create(sequence)
function update() -- 毎フレーム呼ばれる想定
    if coroutine.status(co) ~= "dead" then
        coroutine.resume(co)
    end
end
```
