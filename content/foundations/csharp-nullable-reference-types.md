---
name: Null許容参照型
category: プログラミング言語
subcategory: C#
masteryBadge: review
summary: 参照型が「nullになりうるか」を型システムで表現し、コンパイル時にnull参照例外の芽を摘む機能。
---

## 概要

C# 8.0で導入されたNull許容参照型(Nullable Reference Types)は、`string`のような参照型が「nullを許容するか」を型注釈で明示する機能。`string`は非null、`string?`はnullを許容する型として区別され、コンパイラが「nullチェックなしでの参照」に警告を出せるようになる。

## 基礎文法

```csharp
#nullable enable

string name = "Player"; // 非null: nullを代入しようとすると警告
string? nickname = null; // null許容: 明示的にnullを許容

void PrintNickname()
{
    Console.WriteLine(nickname.Length); // 警告: nicknameがnullの可能性がある
    if (nickname != null)
    {
        Console.WriteLine(nickname.Length); // OK: nullチェック後なので警告なし
    }
}
```

## つまずきやすい点

- あくまで静的解析による警告であり、実行時の安全性を保証するものではない。`!`(null許容抑制演算子)で警告を握りつぶすと、実質的に従来のnull安全性のないコードに戻ってしまう
- 既存プロジェクトに後から`#nullable enable`を導入すると、大量の警告が一度に出ることが多い。ファイル単位・プロジェクト単位で段階的に有効化していくのが現実的
- 外部ライブラリ(null許容注釈が付いていない古いAPI等)との境界では、実際にはnullが返ってくるのに非null型として扱われてしまうことがあり、注意が必要

## 実装例(コード)

```csharp
public class PlayerProfile
{
    public required string Id { get; init; } // 非null、初期化必須
    public string? DisplayName { get; set; }  // null許容
}
```
