---
name: "SerializeFieldとInspectorの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "スクリプトの変数を Inspector に出して、コードを書き換えずに値を調整する仕組み。private のまま出すには SerializeField を付ける。"
claim: "Inspector に出したい private な変数には、[SerializeField] を付ける。public にしなくてよい。"
operationSteps:
  - label: "変数を宣言する"
    note: "`private float speed = 5f;` のような、フィールド(クラスの変数)を書く"
  - label: "SerializeFieldを付与"
    note: "`[SerializeField]` を付けると、private のままで、Inspector に表示される"
  - label: "Inspectorで値を調整する"
    note: "スクリプトを付けたGameObjectを選ぶと、変数が欄として表示され、数値を直接変えられる"
  - label: "値が保存される"
    note: "Inspector で変えた値は、スクリプトのコードではなく、シーンやPrefabのファイルに保存される"
  - label: "属性で見やすくする"
    note: "`[Header]`・`[Range(0, 10)]`・`[Tooltip]` などで、見出し・スライダー・説明を付けられる"
quiz:
  - question: "private な変数を、外部からは隠したまま Inspector に表示するには、何を付けるか"
    choices:
      - "[SerializeField]"
      - "public"
      - "[HideInInspector]"
    answer: 0
    explanation: "SerializeField は、private のまま保存・表示の対象にする。HideInInspector は逆で、public でも表示を隠す。"
---

## 概要

Unityでは、スクリプトの変数(フィールド)を**Inspector**に表示して、実行画面を見ながら調整できる。これは、Unityが、そのフィールドの値を保存・復元する(**シリアライズ**)対象にしているため。`public`なフィールドは自動で対象になるが、他のクラスから自由に書き換えられてしまう。そこで、`private`のまま対象にする`[SerializeField]`が、よく使われる。

## 基礎文法

```csharp
using UnityEngine;

public class Mover : MonoBehaviour
{
    [Header("移動")]
    [SerializeField] private float speed = 5f;
    [SerializeField, Range(0f, 1f)] private float friction = 0.2f;
    [SerializeField, Tooltip("移動の目標")] private Transform target;
}
```

| 属性 | 働き |
| --- | --- |
| [SerializeField] | private でも Inspector に出す・保存する |
| [HideInInspector] | public だが、Inspector では隠す |
| [Header("名前")] | 見出しを付ける |
| [Range(a, b)] | スライダーにする |
| [System.NonSerialized] | 保存の対象から外す |

- シリアライズされる型は、基本的な型(数値・文字列・bool)、`Vector3`などの Unity の型、`UnityEngine.Object`の参照、それらの配列・`List`、`[System.Serializable]`を付けた自作クラス
- スクリプトの変数に、`GameObject`や`Transform`を宣言すると、Inspectorへドラッグして、参照を結び付けられる

## つまずきやすい点

- コードで初期値を変えても、すでにシーンに置いたインスタンスには反映されないことがある。Inspector で変えた値(保存済みの値)が優先されるため。Inspector のコンポーネントのメニューから Reset を実行すると、コードの初期値に戻る
- `static`や`const`、プロパティ(`{ get; set; }`)は、そのままでは表示されない。自動プロパティの背後のフィールドを表示したいときは、`[field: SerializeField]`を使う
- 参照を結び付け忘れると、実行時に`NullReferenceException`になる。`Awake`で`null`を確認し、警告を出す書き方が有効
- フィールド名を変えると、Unityは別のフィールドとみなし、保存済みの値が失われる。名前を変えるときは、`[FormerlySerializedAs("旧い名前")]`を付ける

## 実装例(コード)

```csharp
using UnityEngine;

public class Mover : MonoBehaviour
{
    [SerializeField] private float speed = 5f;
    [SerializeField] private Transform target;

    private void Awake()
    {
        if (target == null)
        {
            Debug.LogWarning("target が未設定です", this);
        }
    }

    private void Update()
    {
        if (target == null) return;
        transform.position = Vector3.MoveTowards(
            transform.position, target.position, speed * Time.deltaTime);
    }
}
```
