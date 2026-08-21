---
name: 自作関数(メソッド)の基礎
category: プログラミング言語
subcategory: C#
masteryBadge: done
summary: C#では関数はクラス内の「メソッド」として定義する。引数・戻り値・アクセス修飾子の組み合わせが基本。
---

## 概要

C#はクラスベースのオブジェクト指向言語のため、関数はトップレベルには置けず(トップレベルステートメントを除き)、クラスの中に「メソッド」として定義するのが基本形。戻り値の型・メソッド名・引数リストを明示する静的型付けの文法を持つ。

## 基礎文法

```csharp
// 戻り値の型 メソッド名(引数の型 引数名, ...)
int Add(int a, int b)
{
    return a + b;
}

// 戻り値がない場合はvoidを使う
void PrintMessage(string message)
{
    Debug.Log(message);
}

// デフォルト引数(呼び出し側で省略可能)
void TakeDamage(int amount, bool isCritical = false)
{
    // ...
}

// 名前付き引数(順序を気にせず指定できる)
TakeDamage(amount: 10, isCritical: true);
```

## つまずきやすい点

- 引数は基本的に値渡し(値のコピーが渡される)だが、`ref`/`out`キーワードを付けると参照渡しになり、呼び出し先での変更が呼び出し元にも反映される。この挙動の違いを意識せずに使うと、意図しない副作用や、逆に反映されない変更に戸惑うことがある
- `out`引数は「呼び出し先で必ず値を設定する」ことが保証される代わりに、呼び出し前の初期値を持たない。`TryParse`のような「成功したかどうかを戻り値で返しつつ、結果を`out`で受け取る」パターンが標準ライブラリで頻出する
- 同じ名前で引数の型・数が異なる複数のメソッドを定義できる(メソッドのオーバーロード)。呼び出し時にどのオーバーロードが選ばれるかは引数の型で決まるため、意図と異なるオーバーロードが呼ばれてしまう「曖昧な呼び出し」に気づきにくいことがある

## 実装例(コード)

```csharp
// out引数を使った典型例
bool TryParseCommand(string input, out int result)
{
    if (int.TryParse(input, out result))
    {
        return true;
    }
    result = 0;
    return false;
}
```
