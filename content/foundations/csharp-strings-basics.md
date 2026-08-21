---
name: 文字列とchar配列の基礎
category: プログラミング言語
subcategory: C#
masteryBadge: done
summary: C#のstringはchar(文字)の読み取り専用シーケンス。内部的には配列に近いが直接要素を書き換えられない。
---

## 概要

C#の`string`は、内部的には`char`(1文字を表す値型)の連続したシーケンスに近い構造を持つが、配列と違って各文字を直接書き換えることはできない(イミュータブル)。文字を1つずつ扱いたい場合は、インデックスでの読み取りアクセスや、明示的な`char[]`への変換を行う。

## 基礎文法

```csharp
string name = "Player";
char firstChar = name[0]; // 'P' (読み取りは可能)
// name[0] = 'X'; // コンパイルエラー: stringの要素は書き換えられない

char[] chars = name.ToCharArray(); // char配列に変換すれば書き換え可能
chars[0] = 'X';
string modified = new string(chars); // "Xlayer"

int length = name.Length; // 文字数
```

## つまずきやすい点

- `string`はイミュータブル(不変)なため、`name += "!"`のような「変更」に見える操作は、実際には新しい文字列オブジェクトを毎回生成している。ループの中で文字列連結を繰り返すと、その都度新しいオブジェクトが生成されGCの負荷([ガベージコレクションの基礎](/foundations/java-garbage-collection-basics)参照)が増えるため、大量の連結には`StringBuilder`を使うのが定石
- `char`はC#では1文字(UTF-16の1コードユニット)を表すが、絵文字のような一部の文字はUTF-16で2コードユニット(サロゲートペア)を必要とする。`string.Length`が「見た目の文字数」と一致しないことがある点に注意が必要
- 文字列比較(`==`や`Equals`)はデフォルトで大文字小文字を区別する。区別しない比較をしたい場合は`StringComparison.OrdinalIgnoreCase`のようなオプションを明示する必要がある

## 実装例(コード)

```csharp
// ループの中での文字列連結を避け、StringBuilderを使う例
var sb = new StringBuilder();
foreach (var item in items)
{
    sb.Append(item).Append(", ");
}
string result = sb.ToString();
```
