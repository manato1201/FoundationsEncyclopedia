---
name: "シーン管理の基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "シーンの読み込みと切り替え。非同期や、加算読み込みで、滑らかに遷移する。"
operationSteps:
  - label: "シーンをビルド設定へ追加する"
    note: "読み込むシーンを、ビルドの設定の一覧へ登録する"
  - label: "シーンを読み込む"
    note: "SceneManager.LoadSceneで、名前や番号を指定して読み込む"
  - label: "非同期で読み込む"
    note: "LoadSceneAsyncで、画面を止めずに、裏で読み込む"
  - label: "加算で重ねる"
    note: "LoadSceneMode.Additiveで、いまのシーンを残して、別のシーンを追加する"
  - label: "不要になったシーンを外す"
    note: "UnloadSceneAsyncで、使い終わったシーンを、メモリから外す"
---

## 概要

Unityでは、ゲームの画面や面を**シーン**として分ける。**SceneManager**で、シーンを読み込んだり、切り替えたりする。通常の読み込みは、現在のシーンを置き換える。**加算(Additive)**で読み込むと、いまのシーンを残したまま、追加できる。

## 基礎文法

| 方法 | 動き |
| --- | --- |
| LoadScene | 現在のシーンを置き換える(同期) |
| LoadSceneAsync | 裏で読み込む(非同期) |
| Additive | 現在のシーンに追加する |

## つまずきやすい点

- ビルド設定に登録されていないシーンは、読み込めない
- 同期の読み込みは、重いと画面が止まる。大きなシーンは、非同期で読み込む
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneLoader : MonoBehaviour
{
    public void LoadGame()
    {
        SceneManager.LoadSceneAsync("Game");  // 非同期で読み込む
    }
}
```
