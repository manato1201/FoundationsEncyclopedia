---
name: ジェネリクスの基礎
category: プログラミング言語
subcategory: C#
masteryBadge: done
summary: 型をパラメータとして受け取ることで、型安全性を保ったまま再利用可能なクラス・メソッドを書く機能。
---

## 概要

C#のジェネリクスは、クラスやメソッドが扱う型を呼び出し側で指定できるようにする機能。`List<T>`や`Dictionary<TKey, TValue>`のようなコレクション型は全てジェネリクスで実装されており、`object`型にキャストして使うより型安全かつボックス化(値型のヒープ確保)のコストも避けられる。

## 基礎文法

```csharp
public class ObjectPool<T> where T : new()
{
    private readonly Stack<T> pool = new();

    public T Rent() => pool.Count > 0 ? pool.Pop() : new T();
    public void Return(T item) => pool.Push(item);
}

var pool = new ObjectPool<Bullet>();
Bullet bullet = pool.Rent();
```

- `where T : new()`のような制約(constraint)で、型パラメータが満たすべき条件を指定できる
- 制約には他にも`where T : class`(参照型限定)、`where T : struct`(値型限定)、`where T : IComparable`(インターフェース実装限定)などがある

## つまずきやすい点

- ジェネリック型に対してさらに制約なしで演算子(`+`等)を使おうとすると、コンパイルエラーになる。型パラメータは「何でもありうる型」として扱われるため、共通のインターフェースを介して操作する必要がある
- 値型(struct)をジェネリクスなしで`object`として扱うとボックス化が発生しGCの負荷が増えるが、ジェネリクスを正しく使えばボックス化を避けられる。Unityのオブジェクトプールのような頻繁に生成/破棄が発生する箇所で特に効いてくる

## 実装例(コード)

```csharp
T Max<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) >= 0 ? a : b;
}
```
