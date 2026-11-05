---
name: UMGでUIを作る基礎(Unreal Engine)
category: ツール別
subcategory: UnrealEngine
summary: Widget Blueprintで画面のUIを作り、Create WidgetとAdd to Viewportで表示する。
operationSteps:
  - label: Widget Blueprintを作る
    note: UIの見た目を作るための、専用のBlueprintを作る
  - label: デザイナーで部品を配置する
    note: ボタン・テキスト・画像などの部品を、画面に並べて見た目を整える
  - label: 値や動きを結びつける
    note: ボタンが押されたときの処理や、テキストに表示する値を、グラフで設定する
  - label: Create Widgetで作る
    note: ゲーム中に、Widget Blueprintから、実際のUIのオブジェクトを作る
  - label: Add to Viewportで画面に出す
    note: 作ったUIを、画面に追加して表示する。不要になったら、画面から外す
---

## 概要

UMG(Unreal Motion Graphics)は、Unreal Engineで**ゲーム内のUI**(メニュー、体力ゲージ、ボタンなど)を作る仕組み。**Widget Blueprint**というアセットに、見た目(デザイナー)と動き(グラフ)を作る。

## 基礎文法

| 要素                            | 役割                             |
| ------------------------------- | -------------------------------- |
| Widget Blueprint                | UIを作るアセット                 |
| デザイナー                      | 部品を配置して、見た目を作る画面 |
| グラフ                          | ボタンの動作など、処理を作る画面 |
| Create Widget / Add to Viewport | UIを作って、画面に出す           |

## つまずきやすい点

- Widget Blueprintを作っただけでは、画面に出ない。**Create Widget**で作り、**Add to Viewport**で追加して初めて表示される
- 同じUIを何度もAdd to Viewportすると、重なって表示される。すでに表示中かを確認するか、参照を保持して使い回す
- 毎フレームの更新に、バインディングを多用すると、負荷が増える。値が変わったときにだけ更新するほうが、軽く済む

## 実装例(コード)

```cpp
// 体力ゲージなどのUIを作って、画面に追加する(クラス名は例)
UUserWidget* Widget = CreateWidget<UUserWidget>(GetWorld(), HudWidgetClass);
if (Widget)
{
    Widget->AddToViewport();
}
```
