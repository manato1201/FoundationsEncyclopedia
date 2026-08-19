---
name: Sequencerの基礎
category: ツール別
subcategory: UnrealEngine
summary: カットシーンやカメラワークを時間軸上で編集する、Unreal EngineのノンリニアシネマティックツールDrop。
---

## 概要

Sequencerは、[UnityのTimelineの基礎](/foundations/unity-timeline-basics)と同様の目的を持つ、Unreal Engineのシネマティック(カットシーン)編集ツール。複数のActor(キャラクター、カメラ、ライト)の動きを、動画編集ソフトに近い操作感でタイムライン上に配置・編集する。

## 基礎文法

Sequencerの主な構成:

```
Sequence
  ├── Camera Cut Track(どのカメラをいつ使うか)
  ├── Character Track(キャラクターのアニメーション・位置)
  └── Audio Track(セリフ・BGM)
```

- 複数のカメラアングルを事前に用意し、Camera Cut Trackで切り替えタイミングを指定することで、映画のような編集が可能

## つまずきやすい点

- Sequencerで制御しているActorの位置や状態を、再生中に通常のゲームプレイロジックが同時に書き換えようとすると、[UnityのTimeline](/foundations/unity-timeline-basics)と同様に制御が競合し、意図しない挙動になることがある
- カットシーンの長さや構成を後から大きく変更すると、Sequencer上に配置した各Trackのタイミング調整を全てやり直す必要が生じることがある。ある程度シーンの構成が固まってから、細部の編集に着手するのが効率的
- Sequencerで再生するアニメーションと、通常のゲームプレイ中に使うAnimation Blueprintの制御が競合しないよう、カットシーン再生中はゲームプレイ入力を無効化するなどの制御が別途必要になることが多い

## 実装例(コード)

```cpp
// C++からSequencerの再生を制御する例
LevelSequenceActor->SequencePlayer->Play();
```
