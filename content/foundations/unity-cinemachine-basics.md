---
name: Cinemachineの基礎
category: ツール別
subcategory: Unity
summary: Cinemachineは、カメラの追従や切り替えを、スクリプトを書かずに設定できるパッケージ。
operationSteps:
  - label: Cinemachineを導入する
    note: Package Managerから、Cinemachineのパッケージを入れる
  - label: 仮想カメラ(Virtual Camera)を作る
    note: 実際のカメラではなく、「どう映すか」を記録した仮想のカメラを置く
  - label: 追従と注視の対象を設定する
    note: Follow(追いかける対象)とLook At(見る対象)を指定する
  - label: メインカメラの Brain が仮想カメラを選ぶ
    note: メインカメラに付く Cinemachine Brain が、使う仮想カメラを選び、滑らかに切り替える
  - label: 優先度で切り替える
    note: 複数の仮想カメラを置き、優先度(Priority)の高いほうを有効にして、カメラを切り替える
---

## 概要

Cinemachineは、Unityで、カメラの動きを**設定だけで**作るためのパッケージ。プレイヤーの追従、シーンに合わせたカメラの切り替え、滑らかな遷移などを、スクリプトを書かずに実現できる。

## 基礎文法

| 要素              | 役割                                                 |
| ----------------- | ---------------------------------------------------- |
| Virtual Camera    | 「どう映すか」を設定した仮想のカメラ(複数置ける)     |
| Cinemachine Brain | メインカメラに付き、有効な仮想カメラを選んで反映する |
| Follow / Look At  | 追いかける対象と、見る対象                           |
| Priority          | 複数の仮想カメラのうち、どれを使うかを決める優先度   |

## つまずきやすい点

- 実際に画面を映すのは、メインカメラ1台。仮想カメラは、その位置や向きを決める役割
- メインカメラに Cinemachine Brain が付いていないと、仮想カメラの設定が反映されない
- パッケージの版によって、コンポーネントの名前や構成が変わる場合がある。使っている版のドキュメントで確認する

## 実装例(コード)

```csharp
using Unity.Cinemachine;  // 版によって名前空間が異なる場合がある(古い版は Cinemachine)
using UnityEngine;

public class CameraSwitcher : MonoBehaviour
{
    [SerializeField] private CinemachineCamera bossCamera;

    public void FocusBoss()
    {
        bossCamera.Priority = 20;  // 優先度を上げて、このカメラに切り替える
    }
}
```
