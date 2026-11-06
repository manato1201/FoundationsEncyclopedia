---
name: ブロックの基礎
category: プログラミング言語
subcategory: Ruby
summary: メソッド呼び出しに付随して渡す、名前を持たないコードの塊。Rubyらしさの中心的な機能。
operationSteps:
  - label: "メソッドにブロックを渡す"
    note: "do ... end または { } で、コードの塊を渡す"
  - label: "メソッドがyieldで呼び出す"
    note: "メソッドの中で、yield を書くと、ブロックが実行される"
  - label: "引数をブロックへ渡す"
    note: "yield 値 で、値を渡す"
  - label: "ブロックが結果を返す"
    note: "ブロックの最後の式が、yield の結果になる"
  - label: "eachやmapで使う"
    note: "繰り返しや変換の、標準メソッドが、ブロックを受け取る"
---

## 概要

ブロックは、メソッド呼び出しに`do...end`または`{...}`で付随させる、名前のないコードの塊。`each`や`map`のような多くのRuby標準メソッドは、内部でこのブロックを繰り返し呼び出すことで動作している。

## 基礎文法

```ruby
[1, 2, 3].each do |n|
  puts n * 2
end

# 1行で書く場合は{}を使うのが慣習
doubled = [1, 2, 3].map { |n| n * 2 } # [2, 4, 6]

# yieldでメソッド内からブロックを呼び出す
def repeat_twice
  yield
  yield
end

repeat_twice { puts "こんにちは" } # 2回出力される
```

## つまずきやすい点

- ブロックはメソッドに1つしか渡せない。複数のコールバックを渡したい場合は、`Proc`オブジェクトや`lambda`を明示的な引数として渡す必要がある
- `do...end`と`{}`は同じ意味だが、演算子の結合順位が異なるため、メソッドチェーンの中で使うと意図しない対象にブロックが結び付くことがある(`{}`の方が結合が強い)
- `yield`はブロックが渡されていない状態で呼び出すとエラーになる。ブロックが渡されているかどうかは`block_given?`で事前にチェックできる

## 実装例(コード)

```ruby
def with_logging
  puts "開始"
  result = block_given? ? yield : nil
  puts "終了"
  result
end

with_logging { 1 + 1 } # 開始 -> 終了 の間に処理が挟まる
```
