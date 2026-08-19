---
name: オブジェクトプーリングの基礎
category: ツール別
subcategory: Unity
masteryBadge: done
summary: オブジェクトの生成・破棄を繰り返す代わりに、使い回すことでGCの負荷を減らす最適化テクニック。
---

## 概要

オブジェクトプーリングは、弾丸やエフェクトのように頻繁に生成・破棄されるオブジェクトを、実際には破棄せず「非表示にして再利用可能な状態で保持」し、次に必要になったときに使い回す最適化テクニック。[ガベージコレクションの基礎](/foundations/java-garbage-collection-basics)で触れた「短命なオブジェクトの大量生成がGCの負荷を上げる」問題への、ゲーム開発における代表的な対策。

## 基礎文法

```csharp
public class BulletPool
{
    private Queue<Bullet> pool = new();

    public Bullet Rent()
    {
        if (pool.Count > 0)
        {
            var bullet = pool.Dequeue();
            bullet.gameObject.SetActive(true);
            return bullet;
        }
        return Object.Instantiate(bulletPrefab).GetComponent<Bullet>();
    }

    public void Return(Bullet bullet)
    {
        bullet.gameObject.SetActive(false);
        pool.Enqueue(bullet);
    }
}
```

## つまずきやすい点

- プールから取り出したオブジェクトの状態(位置、速度、体力等)を明示的にリセットし忘れると、前回使用時の状態が残ったまま再利用され、意図しないバグの原因になる。「借りる時に必ず初期化する」という規約をチームで徹底する必要がある
- Unity 2021以降に導入された標準の`ObjectPool<T>`クラスを使うと、上記のような自作の仕組みを一から実装する必要がなくなる。既存の標準機能を知らずに車輪の再発明をしてしまうことがある
- プールのサイズ(あらかじめ何個生成しておくか)を適切に見積もらないと、瞬間的に大量のオブジェクトが必要になった際にプールが枯渇し、結局その場で新規生成(Instantiate)が発生してしまい、最適化の効果が薄れることがある

## 実装例(コード)

```csharp
// UnityEngine.Pool名前空間の標準ObjectPoolを使う例
using UnityEngine.Pool;

var pool = new ObjectPool<Bullet>(
    createFunc: () => Instantiate(bulletPrefab).GetComponent<Bullet>(),
    actionOnGet: (b) => b.gameObject.SetActive(true),
    actionOnRelease: (b) => b.gameObject.SetActive(false)
);
```
