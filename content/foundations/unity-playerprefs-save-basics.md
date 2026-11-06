---
name: "PlayerPrefsによる簡易セーブの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "設定や小さなデータを、キーと値で保存する。小さなデータ向けの簡易な方法。"
operationSteps:
  - label: "保存したい値を決める"
    note: "音量・最高得点など、小さな設定やデータを決める"
  - label: "キーを決めて値を保存する"
    note: "SetInt・SetFloat・SetStringで、キーと値を保存する"
  - label: "Saveで確定する"
    note: "PlayerPrefs.Saveで、確実に書き込む"
  - label: "次回の起動時に読み込む"
    note: "GetInt・GetFloatなどで、キーから値を読む。なければ、既定の値を使う"
  - label: "大きなデータは別の方法にする"
    note: "多くのデータや複雑な構造は、ファイルへ保存する方法を使う"
---

## 概要

**PlayerPrefs**は、設定やスコアなどの**小さなデータ**を、キーと値で保存する、簡単な仕組み。音量や、最高得点の保存に向く。大量のデータや、複雑なデータの保存には、向かない。

## 基礎文法

| 操作 | メソッド |
| --- | --- |
| 保存 | SetInt / SetFloat / SetString |
| 読み込み | GetInt / GetFloat / GetString |
| 確定 | Save |

## つまずきやすい点

- 保存した値は、暗号化されない。改ざんされて困るデータや、機密のデータには使わない
- 保存の場所は、OSごとに違う。ユーザーが直接編集できる場合もある
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;

public class VolumeSetting : MonoBehaviour
{
    public void Save(float volume)
    {
        PlayerPrefs.SetFloat("Volume", volume);
        PlayerPrefs.Save();
    }

    public float Load() => PlayerPrefs.GetFloat("Volume", 1.0f);  // なければ1.0
}
```
