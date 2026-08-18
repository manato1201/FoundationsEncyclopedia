---
name: Prefab Variantの作成
category: ツール別
subcategory: Unity
masteryBadge: done
summary: 既存Prefabの差分だけを保持する派生アセット。共通レイアウトを保ちつつ個別調整を可能にする。
operationSteps:
  - label: 元になるPrefabを選択
    menuPath: Project ウィンドウ > 対象Prefabを右クリック
  - label: Variantを作成
    menuPath: Create > Prefab Variant
    note: 元Prefabへの変更は自動反映されるが、Variant側の上書き項目は維持される
  - label: 差分プロパティを編集
    note: インスペクタ上で太字表示された項目がVariant固有の上書き値
---

## 概要

Prefab Variantは、既存のPrefab(ベースPrefab)を元に、一部のプロパティだけを上書きした派生Prefabを作る仕組み。ベースPrefabを変更すると、Variant側で上書きしていないプロパティには自動的に変更が反映されるため、「共通部分は一括管理、個別部分だけ差し替え」という運用がしやすい。

## 操作手順(OperationSteps)

frontmatterの`operationSteps`に記載した3手順が、詳細ページのCSSステップアニメーションと連動して表示されます。

## つまずきやすい点

- Variant側で上書きした項目は、ベースPrefabを変更しても自動追従しなくなる。「なぜベース側の変更が反映されないのか」で混乱しやすいポイント
- Variantのそのまた派生(Variant of Variant)を作ることもできるが、階層が深くなるとどこで何を上書きしたのか追いにくくなる
- ベースPrefab自体を削除・移動すると、Variant側が壊れる(参照が解決できなくなる)ため、アセット整理の際は依存関係を確認する必要がある

## 実装例(コード)

```csharp
// スクリプトからPrefab Variantを生成する例(エディタ拡張)
GameObject basePrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/Enemy.prefab");
GameObject instance = (GameObject)PrefabUtility.InstantiatePrefab(basePrefab);
PrefabUtility.SaveAsPrefabAssetAndConnect(instance, "Assets/Prefabs/Enemy_Boss.prefab", InteractionMode.AutomatedAction);
```
