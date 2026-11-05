---
name: Audio Mixerの基礎(Unity)
category: ツール別
subcategory: Unity
summary: 音をグループ(BGM・効果音など)に分けて、音量やエフェクトをまとめて調整する。
operationSteps:
  - label: Audio Mixerを作る
    note: ミキサーのアセットを作って、音の流れ(グループ)を組む
  - label: グループを作る
    note: BGM・効果音・声などのグループを作って、音を種類ごとに分ける
  - label: AudioSourceをグループにつなぐ
    note: 音を鳴らすAudioSourceの出力先を、対応するグループに設定する
  - label: 音量やエフェクトを調整する
    note: グループごとに、音量・エフェクトを調整する
  - label: パラメーターを公開して、スクリプトから操作する
    note: 音量などの値を公開しておくと、設定画面のスライダーなどから操作できる
---

## 概要

Audio Mixerは、Unityで音を**グループごとにまとめて管理**する仕組み。BGMと効果音の音量を別々に調整する、設定画面で音量を変える、といったことができる。

## 基礎文法

| 要素              | 役割                                       |
| ----------------- | ------------------------------------------ |
| Audio Mixer       | 音のグループとエフェクトを管理するアセット |
| グループ          | BGM・効果音など、音の種類ごとのまとまり    |
| Exposed Parameter | スクリプトから操作できるように公開した値   |

## つまずきやすい点

- AudioSourceの出力先をグループに設定しないと、ミキサーの調整が反映されない
- 音量はデシベル(dB)で扱う。スライダーの値(0〜1)をそのまま渡さず、対数に変換する
- 公開した値は、ミキサー側でパラメーターとして登録してから、スクリプトで操作する

## 実装例(コード)

```csharp
using UnityEngine;
using UnityEngine.Audio;

public class VolumeSetting : MonoBehaviour
{
    [SerializeField] private AudioMixer mixer;

    public void SetBgmVolume(float value01)
    {
        float db = Mathf.Log10(Mathf.Max(value01, 0.0001f)) * 20f;  // 0〜1をdBへ変換する
        mixer.SetFloat("BgmVolume", db);  // 公開したパラメーター名
    }
}
```
