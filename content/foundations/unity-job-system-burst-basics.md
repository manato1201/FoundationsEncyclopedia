---
name: Job SystemとBurstの基礎(Unity)
category: ツール別
subcategory: Unity
summary: 処理を小さな仕事(Job)に分けて複数のコアで並列に動かし、Burstで高速な機械語にする。
operationSteps:
  - label: 並列にできる処理を見つける
    note: たくさんの要素に、同じ計算をする処理が向いている
  - label: データをNativeArrayに入れる
    note: Jobが扱うデータは、管理対象のオブジェクトではなく、NativeArrayなどの専用の入れ物に入れる
  - label: Jobを定義する
    note: 構造体(IJob・IJobParallelForなど)に、処理を書く
  - label: Jobを予約して実行する
    note: Scheduleで予約すると、複数のワーカースレッドで並列に実行される
  - label: 完了を待って結果を使う
    note: Completeで完了を待ってから、結果を読む。使い終わったNativeArrayは解放する
---

## 概要

**C# Job System**は、処理を**Job**という小さな単位に分けて、複数のCPUコアで並列に実行する仕組み。**Burst**は、Jobのコードを高速な機械語に変換するコンパイラ。多くの要素に同じ計算をする処理で、大きな高速化が期待できる。

## 基礎文法

| 要素                | 役割                              |
| ------------------- | --------------------------------- |
| Job                 | 並列に実行する処理の単位(構造体)  |
| NativeArray         | Jobと受け渡すための、専用の配列   |
| Schedule / Complete | Jobの予約と、完了待ち             |
| Burst               | Jobを高速な機械語にコンパイルする |

## つまずきやすい点

- Jobの中では、通常のクラスや文字列などの管理対象の型は、使える範囲が限られる(特にBurstを使うとき)。値型のデータで扱う
- NativeArrayは、使い終わったら自分で解放する(`Dispose`)。解放し忘れると、メモリリークになる
- 処理が軽いときは、Jobにするオーバーヘッドのほうが大きく、かえって遅くなる。重い処理だけに使う

## 実装例(コード)

```csharp
using Unity.Burst;
using Unity.Collections;
using Unity.Jobs;

[BurstCompile]
public struct DoubleJob : IJobParallelFor
{
    public NativeArray<float> values;

    public void Execute(int index)
    {
        values[index] *= 2f;  // 要素ごとに並列に実行される
    }
}
```
