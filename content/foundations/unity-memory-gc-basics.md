---
name: "メモリとGC(ガベージコレクション)の基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "不要なメモリの確保を減らして、GCによる一時的なカクつきを防ぐ。"
operationSteps:
  - label: "メモリの確保が起きる場所を知る"
    note: "newでの生成、文字列の連結などで、メモリが確保される"
  - label: "確保したメモリが溜まる"
    note: "使い終わったものが、すぐには解放されず、溜まっていく"
  - label: "GCが動いて一時停止する"
    note: "溜まったメモリを回収する間、処理が一瞬止まり、カクつくことがある"
  - label: "Updateでの確保を減らす"
    note: "毎フレームの確保を避け、使い回す(キャッシュ・プール)"
  - label: "Profilerで確認する"
    note: "GC Allocの数値が、毎フレーム増えていないかを確かめる"
---

## 概要

Unityのスクリプト(C#)は、使い終わったメモリを、**GC**(ガベージコレクション)が自動で回収する。回収のときに、**処理が一瞬止まる**ことがある。毎フレーム、メモリを確保していると、GCが頻繁に動き、カクつきの原因になる。

## 基礎文法

| 原因になりやすい例 | 対策 |
| --- | --- |
| Updateでのnew | 事前に作って使い回す |
| 文字列の連結 | StringBuilderなどを使う |
| LINQの多用 | ループで書く(重い箇所のみ) |

## つまずきやすい点

- 小さな確保でも、毎フレーム続くと積み重なる。Profilerで、確保の量を確認する
- 最適化は、測って問題を確認してから行う。むやみに複雑にしない
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;

public class Cache : MonoBehaviour
{
    private readonly RaycastHit[] hits = new RaycastHit[8];  // 事前に確保して使い回す

    private void Update()
    {
        int count = Physics.RaycastNonAlloc(transform.position, transform.forward, hits); // 確保なし版
    }
}
```
