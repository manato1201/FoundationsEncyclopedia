---
name: コルーチンの基礎
category: ツール別
subcategory: Unity
masteryBadge: done
summary: 複数フレームにまたがる処理を、通常の関数のように直線的に書けるようにするUnity独自の仕組み。
---

## 概要

Unityのコルーチンは、`yield return`を使って処理を一時中断し、指定した条件(次のフレーム、一定時間経過等)が満たされたら再開する、複数フレームにまたがる処理を記述するための仕組み。[Luaのコルーチン](/foundations/lua-coroutines-basics)と発想は近く、演出のシーケンス制御やアニメーションのような「時間経過を伴う処理」を、コールバックの連鎖ではなく直線的なコードで書ける。

## 基礎文法

```csharp
IEnumerator FadeOut()
{
    float duration = 1.0f;
    float elapsed = 0f;
    while (elapsed < duration)
    {
        elapsed += Time.deltaTime;
        canvasGroup.alpha = 1f - (elapsed / duration);
        yield return null; // 次のフレームまで一時中断
    }
}

StartCoroutine(FadeOut());
```

- `yield return null`: 次のフレームまで待つ
- `yield return new WaitForSeconds(1.0f)`: 指定秒数だけ待つ

## つまずきやすい点

- コルーチンはGameObjectに紐づいており、そのGameObjectが非アクティブになったり破棄されたりすると、実行中のコルーチンも自動的に停止する。「なぜか処理が途中で止まる」というバグの多くは、コルーチンを開始したオブジェクトのライフサイクルに起因することが多い
- コルーチンは非同期処理のように見えるが、実際にはメインスレッド上で(他の`Update`等と同じスレッドで)実行される。真の並列処理(別スレッドでの実行)ではないため、重い計算処理をコルーチンに入れても、フレームレートへの影響は変わらない
- `StartCoroutine`で開始したコルーチンの戻り値(`Coroutine`型)を保持しておかないと、`StopCoroutine`で個別に停止させることができなくなる。複数のコルーチンを管理する場合は、参照を適切に保持しておく必要がある

## 実装例(コード)

```csharp
private Coroutine currentFade;

void StartFading()
{
    if (currentFade != null) StopCoroutine(currentFade);
    currentFade = StartCoroutine(FadeOut());
}
```
