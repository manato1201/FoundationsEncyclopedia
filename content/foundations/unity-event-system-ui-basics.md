---
name: "EventSystemとUIの入力の基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "EventSystemが、クリックやタッチなどの入力を、UIの要素へ届ける。"
operationSteps:
  - label: "EventSystemがシーンにあることを確認する"
    note: "UIを使うシーンには、EventSystemが必要"
  - label: "入力を受け取る"
    note: "マウスやタッチの入力を、EventSystemが受け取る"
  - label: "Graphic Raycasterで当たりを調べる"
    note: "Canvasが、クリックした位置にあるUIを判定する"
  - label: "UIの要素にイベントを送る"
    note: "ボタンなどへ、クリックされたというイベントを送る"
  - label: "処理を実行する"
    note: "ボタンのOnClickなどに登録した処理が、呼ばれる"
---

## 概要

UIのボタンを押したときの反応は、**EventSystem**が仲立ちしている。マウスやタッチの入力を受け取り、画面上のどのUIにあたったかを調べ、その要素へ**イベント**を送る。UIを使うシーンには、EventSystemが必要。

## 基礎文法

| 要素 | 役割 |
| --- | --- |
| EventSystem | 入力をUIへ届ける |
| Graphic Raycaster | UIに当たったかを判定する |
| イベントのインターフェース | IPointerClickHandlerなど |

## つまずきやすい点

- EventSystemがないと、ボタンが反応しない。シーンに1つだけ置く
- 入力システム(新旧)によって、使うコンポーネントが違う。設定を確認する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;
using UnityEngine.EventSystems;

public class Clickable : MonoBehaviour, IPointerClickHandler
{
    public void OnPointerClick(PointerEventData eventData)
    {
        Debug.Log("クリックされた");
    }
}
```
