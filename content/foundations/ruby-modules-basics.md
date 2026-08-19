---
name: モジュールとMix-in
category: プログラミング言語
subcategory: Ruby
summary: インスタンス化できない名前空間・機能のまとまりを、クラスに「取り込む」ことで多重継承に似た効果を得る仕組み。
---

## 概要

モジュール(`module`)は、クラスと似ているがインスタンス化できない、メソッドや定数のまとまり。`include`でクラスに取り込む(Mix-inする)と、そのモジュールのメソッドがクラスのインスタンスメソッドとして使えるようになる。Rubyは単一継承の言語だが、Mix-inにより複数のモジュールの機能を1つのクラスに組み合わせられる。

## 基礎文法

```ruby
module Comparable2
  def greater_than?(other)
    (self <=> other) > 0
  end
end

class Money
  include Comparable2
  attr_reader :amount
  def initialize(amount) = @amount = amount
  def <=>(other) = amount <=> other.amount
end

Money.new(100).greater_than?(Money.new(50)) # true
```

- `include`: インスタンスメソッドとしてMix-inする
- `extend`: そのオブジェクト(またはクラス自身)の特異メソッド・クラスメソッドとしてMix-inする

## つまずきやすい点

- 複数のモジュールを`include`すると、メソッド探索順序(祖先チェーン、`ancestors`メソッドで確認可能)によって、同名メソッドがあった場合にどちらが優先されるかが決まる。後から`include`したモジュールの方が優先されるという順序を意識していないと、意図しないメソッドが呼ばれることがある
- `include`と`extend`を混同しやすい。「インスタンスに機能を足したいのか、クラス自身(クラスメソッド)に機能を足したいのか」で使い分けが必要
- モジュールを多用しすぎると、あるメソッドが実際にはどのモジュール由来なのかを追うのが難しくなる。Rubyの標準ライブラリの`Comparable`や`Enumerable`のように、明確に単一の責務を持つモジュールに限定するのが望ましい

## 実装例(コード)

```ruby
module Enumerable2
  def average
    sum.to_f / count
  end
end

class NumberList
  include Enumerable2
  # sumやcountを自前で実装する必要はなく、Array由来の実装を利用する構成も可能
end
```
