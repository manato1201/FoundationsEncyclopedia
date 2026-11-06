---
name: "Layout Groupの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "UIの子要素を、縦・横・格子に、自動で並べる。要素の数や大きさが変わっても整う。"
operationSteps:
  - label: "並べたいUIをまとめる"
    note: "親のオブジェクトの下に、並べたい要素を置く"
  - label: "Layout Groupを付ける"
    note: "Horizontal・Vertical・Gridのいずれかを、親へ付ける"
  - label: "間隔や余白を設定する"
    note: "要素の間隔(Spacing)や、周囲の余白(Padding)を設定する"
  - label: "大きさの扱いを決める"
    note: "子の大きさを、自動で調整するかを設定する"
  - label: "要素を増減して確認する"
    note: "要素を追加・削除して、自動で並び直されることを確かめる"
---

## 概要

**Layout Group**は、UIの子要素を、**縦・横・格子状**に自動で並べる仕組み。要素の数が変わるリストや、ボタンの並びでよく使う。**Content Size Fitter**と組み合わせると、中身に合わせて、大きさも変えられる。

## 基礎文法

| 種類 | 並び方 |
| --- | --- |
| Horizontal Layout Group | 横一列 |
| Vertical Layout Group | 縦一列 |
| Grid Layout Group | 格子状 |

## つまずきやすい点

- 子要素の位置や大きさは、Layout Groupが管理する。手で動かしても、元に戻される
- Layout Groupを重ねすぎると、計算が重くなる。階層を浅く保つ
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;
using UnityEngine.UI;

public class ListBuilder : MonoBehaviour
{
    [SerializeField] private RectTransform content;
    [SerializeField] private GameObject itemPrefab;

    public void Add()
    {
        Instantiate(itemPrefab, content);  // VerticalLayoutGroupの子に追加すると、自動で並ぶ
    }
}
```
