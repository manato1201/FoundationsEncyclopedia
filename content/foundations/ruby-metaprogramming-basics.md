---
name: メタプログラミングの基礎
category: プログラミング言語
subcategory: Ruby
masteryBadge: advanced
summary: 実行時にクラスやメソッドの定義そのものを操作する、Rubyの柔軟性を象徴する技法。
---

## 概要

メタプログラミングは、「コードを書くコード」を書く技法。Rubyはクラス定義自体が実行時のコードであるという特性上、メタプログラミングと非常に親和性が高く、`method_missing`や`define_method`を使って動的にメソッドを生成するライブラリ(Ruby on Railsの`ActiveRecord`等)が広く使われている。

## 基礎文法

```ruby
class DynamicAttributes
  def method_missing(name, *args)
    # 定義されていないメソッド呼び出しをここで捕捉できる
    if name.to_s.start_with?("get_")
      attr = name.to_s.sub("get_", "")
      "#{attr}の値"
    else
      super
    end
  end
end

DynamicAttributes.new.get_name # => "nameの値" (get_nameというメソッドは定義していない)
```

- `method_missing`: 未定義のメソッド呼び出しを横取りする
- `define_method`: 実行時に動的にメソッドを定義する

## つまずきやすい点

- `method_missing`を使うと、実際に呼び出せるメソッドが静的なコードから読み取れなくなる。IDEの補完やコードジャンプが効かなくなり、コードの可読性・保守性を犠牲にする代償が大きい
- `method_missing`をオーバーライドする際、対応できないメソッド名に対しては必ず`super`を呼んで元の挙動(`NoMethodError`)にフォールバックさせる必要がある。忘れると本来のエラーが握りつぶされ、デバッグが困難になる
- 過度なメタプログラミングは「魔法のように動くが中身が読めないコード」を生みやすい。動的な生成が本当に必要な場面(DSLの構築等)に限定し、通常のメソッド定義で済む場面では使わないのが望ましい

## 実装例(コード)

```ruby
class AttributeBuilder
  [:name, :hp, :mp].each do |attr|
    define_method(attr) { instance_variable_get("@#{attr}") }
    define_method("#{attr}=") { |value| instance_variable_set("@#{attr}", value) }
  end
end
```
