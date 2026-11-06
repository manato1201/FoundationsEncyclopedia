---
name: "TextMeshProの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "TextMeshProは、鮮明で表現力の高いテキストを表示する。フォントアセットを作って使う。"
operationSteps:
  - label: "TextMeshProを導入する"
    note: "UIでのテキストの表示に、TextMeshProを使う"
  - label: "フォントアセットを作る"
    note: "使いたいフォントから、専用のフォントアセットを作る"
  - label: "テキストを配置する"
    note: "UIにTextMeshProのテキストを置き、文字を入力する"
  - label: "見た目を整える"
    note: "大きさ・色・縁取り・揃えなどを設定する"
  - label: "スクリプトから値を変える"
    note: "TMP_Textのtextプロパティで、表示する文字を変更する"
---

## 概要

**TextMeshPro**(TMP)は、Unityのテキスト表示の標準的な仕組み。拡大しても文字が鮮明で、縁取りや影などの効果も付けられる。日本語など、多くの文字を使うときは、**フォントアセット**の作り方に注意する。

## 基礎文法

| 要素 | 役割 |
| --- | --- |
| TMP_Text | テキストを扱う基本のクラス |
| フォントアセット | TMPが使う、文字の画像データ |

## つまずきやすい点

- 使いたい文字が、フォントアセットに含まれていないと、表示されない(豆腐のような四角になる)
- 文字数の多い言語では、フォントアセットが大きくなる。必要な文字に絞る方法もある
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using TMPro;
using UnityEngine;

public class ScoreText : MonoBehaviour
{
    [SerializeField] private TMP_Text label;

    public void SetScore(int score)
    {
        label.text = $"スコア: {score}";
    }
}
```
