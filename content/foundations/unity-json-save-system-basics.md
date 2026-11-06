---
name: "JSONによるセーブデータの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "セーブするデータを、クラスにまとめて、JSONとしてファイルへ保存する。"
operationSteps:
  - label: "保存するデータをクラスにまとめる"
    note: "セーブしたい値を、[Serializable]なクラスにまとめる"
  - label: "JSONの文字列に変換する"
    note: "JsonUtility.ToJsonで、クラスをJSONの文字列にする"
  - label: "保存先のパスを決める"
    note: "Application.persistentDataPathの下に、ファイルとして保存する"
  - label: "ファイルから読み込む"
    note: "JsonUtility.FromJsonで、JSONを、クラスへ戻す"
  - label: "ファイルがない場合に備える"
    note: "初回起動などで、ファイルがないときの、初期値を用意する"
---

## 概要

セーブデータが複雑になったら、**クラスにまとめて、JSONでファイルに保存**する方法が使われる。`JsonUtility` で、クラスとJSONを、相互に変換できる。保存先は、OSごとに用意された**persistentDataPath**を使う。

## 基礎文法

| 要素 | 役割 |
| --- | --- |
| [Serializable] | JSONへ変換できるクラスの印 |
| JsonUtility | クラスとJSONの変換 |
| persistentDataPath | データを保存するための、書き込み可能な場所 |

## つまずきやすい点

- `JsonUtility` は、辞書(Dictionary)などの一部の型を、そのままでは扱えない
- セーブデータの形を変えると、古いデータが読めなくなる。バージョンの番号を持たせる
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using System.IO;
using UnityEngine;

[System.Serializable]
public class SaveData { public int level; public float hp; }

public static class SaveSystem
{
    static string Path_ => Path.Combine(Application.persistentDataPath, "save.json");

    public static void Save(SaveData data) => File.WriteAllText(Path_, JsonUtility.ToJson(data));
    public static SaveData Load() => JsonUtility.FromJson<SaveData>(File.ReadAllText(Path_));
}
```
