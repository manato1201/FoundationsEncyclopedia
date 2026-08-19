---
name: イベントとデリゲート
category: プログラミング言語
subcategory: C#
summary: 「関数を値として持ち回す」デリゲートと、それを安全に公開するためのイベント機構。
---

## 概要

デリゲート(delegate)は、メソッドを参照する型。C#では関数もデータのように変数に代入したり引数として渡したりでき、その仕組みの土台になっている。イベント(event)は、デリゲートを「外部からは購読(+=)と解除(-=)しかできない」形に制限して公開するための機構で、Unityの`UnityEvent`やC#標準の`event`キーワードで広く使われる。

## 基礎文法

```csharp
public class Health
{
    public event Action<int> OnDamaged; // デリゲート型Actionを使ったイベント

    public void TakeDamage(int amount)
    {
        OnDamaged?.Invoke(amount); // 購読者がいなければ何もしない(null条件演算子)
    }
}

// 購読側
health.OnDamaged += (amount) => Debug.Log($"{amount}のダメージを受けた");
```

## つまずきやすい点

- イベントの購読を解除(`-=`)し忘れると、購読していたオブジェクトが破棄されてもイベント発行元から参照され続け、メモリリークの原因になる(特にUnityでシーン遷移時にオブジェクトが破棄される場合)
- `event`を使わず`public Action OnDamaged;`のように公開すると、外部から`OnDamaged = null;`のように上書きされたり、`Invoke()`を外部から直接呼ばれたりしてしまう。`event`キーワードはこれらの誤用を型システムレベルで防ぐ
- イベントの購読者が多い場合、発行順序は購読した順に依存する。順序に依存したロジックを組むと、購読タイミングによって挙動が変わる脆いコードになりやすい

## 実装例(コード)

```csharp
public class ScoreManager
{
    public event Action<int> OnScoreChanged;
    private int score;

    public void AddScore(int amount)
    {
        score += amount;
        OnScoreChanged?.Invoke(score);
    }
}
```
