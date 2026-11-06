---
name: "Localizationの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "文字やアセットを、言語ごとのテーブルで管理して、表示する言語を切り替える。"
operationSteps:
  - label: "パッケージを導入する"
    note: "Localizationのパッケージを、プロジェクトへ追加する"
  - label: "使う言語(ロケール)を登録する"
    note: "対応する言語を、ロケールとして追加する"
  - label: "文字列のテーブルを作る"
    note: "キーと、言語ごとの文章を、テーブルへ登録する"
  - label: "UIにキーを結びつける"
    note: "表示する文字を、直接書かず、キーを指定する"
  - label: "言語を切り替えて確認する"
    note: "ロケールを切り替えて、表示が変わることを確かめる"
---

## 概要

**Localization**は、ゲームの文字や画像を、**言語ごとに切り替える**仕組み。文章を、コードやUIに直接書かず、**キー**で参照して、言語ごとの**テーブル**から、取り出す。

## 基礎文法

| 要素 | 役割 |
| --- | --- |
| ロケール | 言語や地域の設定 |
| 文字列テーブル | キーと、言語ごとの文章の対応表 |
| キー | 文章を指す名前 |

## つまずきやすい点

- 文章をコードに直接書いていると、後から、言語を増やすのが大変になる。最初からキーで管理する
- 言語によって、文章の長さが変わる。UIのレイアウトが崩れないかを確認する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;
using UnityEngine.Localization.Settings;

public class LanguageSwitch : MonoBehaviour
{
    public void SetLocale(int index)
    {
        LocalizationSettings.SelectedLocale = LocalizationSettings.AvailableLocales.Locales[index];
    }
}
```
