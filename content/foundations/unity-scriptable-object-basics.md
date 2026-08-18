---
name: ScriptableObjectの使いどころ
category: ツール別
subcategory: Unity
masteryBadge: advanced
summary: シーンに依存しないデータアセットを作るための仕組み。設定値やマスタデータの管理に向く。
operationSteps:
  - label: ScriptableObjectを継承したクラスを定義する
    note: "MonoBehaviourではなくScriptableObjectを継承し、[CreateAssetMenu]属性を付与する"
  - label: アセットとして生成する
    menuPath: Project ウィンドウ右クリック > Create > (定義したメニュー名)
  - label: 値を設定してアセット化する
    note: インスペクタ上でフィールドに値を入力すると、その内容が.assetファイルとして保存される
  - label: 他のコンポーネントから参照する
    note: MonoBehaviour側にScriptableObject型のフィールドを持たせ、インスペクタでドラッグ&ドロップして紐付ける
---

## 概要

ScriptableObjectは、シーン上のGameObjectに依存せずに存在できるデータコンテナ。MonoBehaviourと違ってシーンにアタッチする必要がなく、プロジェクト内のアセットとして独立して保持される。武器のパラメータ・敵の設定値・ゲームバランスの調整値のような「シーンをまたいで共有したいデータ」の管理に向く。

## 操作手順(OperationSteps)

frontmatterの`operationSteps`に記載した4手順が、詳細ページのCSSステップアニメーションと連動して表示されます。

## つまずきやすい点

- ScriptableObjectのインスタンスはアセットとして1つの実体を複数の場所から参照する仕組みのため、実行時にフィールドの値を書き換えると、その変更はアセット自体(エディタ上のデータ)に永続化されてしまうことがある(意図しない共有状態の変更)。実行時に変更したい値は別途ランタイム用のインスタンスにコピーするなどの対策が必要
- MonoBehaviourと違い、シーンに配置されないため`Update()`のようなライフサイクルメソッドを持たない。毎フレーム処理が必要なロジックの置き場所には向かない
- 大量のマスタデータをScriptableObjectで持つ場合、参照が多くなるとエディタでのアセット管理(命名規則・フォルダ構成)を疎かにすると後から扱いにくくなる

## 実装例(コード)

```csharp
[CreateAssetMenu(menuName = "Data/EnemyStats")]
public class EnemyStats : ScriptableObject
{
    public string DisplayName;
    public int MaxHp;
    public float MoveSpeed;
}

// 参照側
public class EnemyController : MonoBehaviour
{
    [SerializeField] private EnemyStats stats;
    private int currentHp;

    private void Awake() => currentHp = stats.MaxHp;
}
```
