---
name: Timelineの基礎
category: ツール別
subcategory: Unity
summary: カットシーンや演出を、複数のトラックを時間軸上に並べて視覚的に編集できるUnityの機能。
---

## 概要

Timelineは、アニメーション・カメラの切り替え・音声再生といった複数の要素を、動画編集ソフトのようなタイムライン形式で視覚的に配置・編集できるUnityの機能。カットシーンやスクリプトイベントの演出を、コードだけで細かくタイミング調整するよりも直感的に組み立てられる。

## 基礎文法

Timelineを構成する主な要素:

- **Timeline Asset**: タイムライン全体のデータを保持するアセット
- **Track**: アニメーション、音声、アクティベーションなど、種類ごとのレーン
- **Clip**: 各トラック上に配置される、実際の再生区間

```csharp
// スクリプトからTimelineの再生を制御する例
PlayableDirector director = GetComponent<PlayableDirector>();
director.Play();

director.stopped += (playableDirector) =>
{
    Debug.Log("カットシーンが終了しました");
};
```

## つまずきやすい点

- Timelineで制御されているオブジェクトのTransform等を、再生中に別のスクリプト(通常のゲームプレイロジック)が同時に書き換えようとすると、Timeline側の制御と競合し、意図しない挙動になることがある。「Timeline再生中はそのオブジェクトの制御をTimelineに一任する」という設計上の切り分けが重要
- 複雑なカットシーンをTimelineに全て詰め込みすぎると、トラック数が増え、後から見返した際に全体の流れを把握しにくくなる。関連するクリップをグループ化する、複数のTimelineアセットに分割するといった整理が有効
- Timeline上のアニメーションクリップの長さと、実際のアニメーションデータの長さが一致していないと、意図しない位置でループしたり、途中で切れたりすることがある

## 実装例(コード)

```csharp
// Timelineの再生速度を動的に変更する例(スロー演出等)
director.playableGraph.GetRootPlayable(0).SetSpeed(0.5);
```
