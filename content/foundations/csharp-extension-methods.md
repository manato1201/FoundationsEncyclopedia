---
name: 拡張メソッド
category: プログラミング言語
subcategory: C#
summary: 既存の型のソースコードを変更せずに、あたかもメンバーメソッドのように新しい機能を追加できる仕組み。
---

## 概要

拡張メソッドは、既存の型(自作クラスだけでなく`string`のような組み込み型・他社製ライブラリの型も含む)に対して、ソースコードを変更せずに新しいメソッドを追加できたかのように見せる仕組み。LINQの`Where`/`Select`も、実は`IEnumerable<T>`に対する拡張メソッドとして実装されている。

## 基礎文法

```csharp
public static class StringExtensions
{
    // 第一引数のthisが拡張対象の型を示す
    public static bool IsNullOrBlank(this string? value)
    {
        return string.IsNullOrWhiteSpace(value);
    }
}

// 呼び出し側: あたかもstringのメンバーメソッドのように呼べる
string input = "  ";
bool blank = input.IsNullOrBlank();
```

- 拡張メソッドは`static class`内の`static`メソッドとして定義する
- 第一引数に`this`修飾子を付けた型が、拡張対象の型になる

## つまずきやすい点

- 拡張メソッドは実際にはただの静的メソッド呼び出しに過ぎず、対象オブジェクトの`private`メンバーにはアクセスできない。「インスタンスメソッドのように見える」だけであり、カプセル化を破れるわけではない
- 同じシグネチャの拡張メソッドが複数の名前空間に存在すると、`using`のスコープによってどちらが呼ばれるかが変わり、意図しない挙動につながることがある
- 何でもかんでも拡張メソッド化すると、その型の「本来の責務」が見えにくくなる。特定のドメイン(このプロジェクトの都合)に依存する処理は拡張メソッドよりも通常のヘルパー関数の方が適切なこともある

## 実装例(コード)

```csharp
public static class TransformExtensions
{
    public static void ResetLocal(this Transform transform)
    {
        transform.localPosition = Vector3.zero;
        transform.localRotation = Quaternion.identity;
        transform.localScale = Vector3.one;
    }
}
```
