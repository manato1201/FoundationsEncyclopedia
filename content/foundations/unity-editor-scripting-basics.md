---
name: エディタ拡張の基礎
category: ツール別
subcategory: Unity
masteryBadge: review
summary: Unityエディタ自体の機能をC#でカスタマイズし、独自のツールやインスペクタ表示を作る仕組み。
---

## 概要

Unityのエディタ拡張は、`UnityEditor`名前空間のAPIを使って、エディタ自体の見た目や機能をカスタマイズする仕組み。カスタムインスペクタ、独自のウィンドウ、メニュー項目の追加など、開発チームの作業効率を上げるためのツール作成に使われる。

## 基礎文法

```csharp
using UnityEditor;
using UnityEngine;

// メニューバーに新しい項目を追加する
public class MyTool
{
    [MenuItem("Tools/エントリを一括生成")]
    static void GenerateEntries()
    {
        Debug.Log("処理を実行しました");
    }
}

// カスタムインスペクタの例
[CustomEditor(typeof(EnemyStats))]
public class EnemyStatsEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();
        if (GUILayout.Button("ステータスをリセット"))
        {
            // ボタンが押された時の処理
        }
    }
}
```

## つまずきやすい点

- エディタ拡張のコードは、`Editor`フォルダという特別な名前のフォルダに配置しないと、ビルド時にゲーム本体のコードとして扱われようとしてコンパイルエラーになる(`UnityEditor`名前空間は実機ビルドには含まれないため)
- エディタ拡張のGUIコードは、即座に画面へ描画結果を反映する即時モード(IMGUI)という独特のパラダイムで書かれる。通常のUIプログラミング(状態を持つコンポーネント)とは異なる発想が必要で、複雑なツールを作る際は特に癖を感じやすい
- 大規模なエディタ拡張ツールを自作する前に、Unity標準の機能やアセットストアの既存ツールで解決できないかを確認する価値がある。車輪の再発明にコストをかけすぎないバランス感覚が実務的

## 実装例(コード)

```csharp
// 選択中のオブジェクトに対して一括処理を行うエディタ拡張の例
[MenuItem("Tools/選択オブジェクトの名前を一括変更")]
static void RenameSelected()
{
    foreach (var obj in Selection.gameObjects)
    {
        obj.name = "Renamed_" + obj.name;
    }
}
```
