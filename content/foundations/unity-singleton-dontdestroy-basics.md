---
name: "シングルトンとDontDestroyOnLoadの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "シーンをまたいで1つだけ残したいオブジェクトを、DontDestroyOnLoadで保持する。"
operationSteps:
  - label: "1つだけ必要なものを決める"
    note: "音の管理や、ゲーム全体の状態など、シーンをまたいで1つあればよいものを決める"
  - label: "静的なInstanceを持たせる"
    note: "自分自身を、staticな変数に保持して、どこからでも参照できるようにする"
  - label: "2つ目ができたら破棄する"
    note: "すでにあれば、あとから作られたものを破棄して、1つだけにする"
  - label: "DontDestroyOnLoadを呼ぶ"
    note: "シーンを切り替えても、破棄されないようにする"
  - label: "使いすぎない"
    note: "どこからでも触れる便利さの反面、依存が増える。必要なものに絞る"
---

## 概要

シーンを切り替えると、通常、そのシーンのオブジェクトは破棄される。**DontDestroyOnLoad**を使うと、破棄されず、シーンをまたいで残る。これと、**1つだけ**にする**シングルトン**を組み合わせるのは、音や設定の管理でよく使われる。

## 基礎文法

| 要素 | 役割 |
| --- | --- |
| static Instance | どこからでも参照できる、唯一の参照 |
| DontDestroyOnLoad | シーンの切り替えで破棄されなくする |

## つまずきやすい点

- シーンに初めから置くと、戻ったときに、2つ目ができる。重複のチェックを入れる
- シングルトンに頼りすぎると、依存が増えて、テストしにくくなる
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    private void Awake()
    {
        if (Instance != null) { Destroy(gameObject); return; }  // 2つ目は破棄する
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }
}
```
