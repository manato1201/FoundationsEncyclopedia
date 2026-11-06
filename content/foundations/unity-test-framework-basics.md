---
name: "Test Frameworkの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "Edit ModeとPlay Modeのテストを書いて、ゲームの動きを自動で確かめる。"
operationSteps:
  - label: "テスト用のアセンブリを用意する"
    note: "テストのコードを、専用のフォルダとアセンブリに置く"
  - label: "テストを書く"
    note: "NUnitの属性([Test])を付けた、関数を書く"
  - label: "Edit Modeかplay Modeかを選ぶ"
    note: "ロジックだけを試すならEdit Mode。実行中の動きを試すならPlay Mode"
  - label: "Test Runnerで実行する"
    note: "Test Runnerの画面で、テストを実行して、結果を見る"
  - label: "失敗を直して繰り返す"
    note: "失敗したテストの原因を直し、もう一度実行する"
---

## 概要

**Test Framework**は、Unityでテストを書いて実行する仕組み。ゲームのロジックを確かめる**Edit Modeテスト**と、実行中の動きを確かめる**Play Modeテスト**がある。結果は**Test Runner**で確認する。

## 基礎文法

| 種類 | 用途 |
| --- | --- |
| Edit Mode | ロジックの単体テスト(ゲームを実行せず) |
| Play Mode | 実行中の動きを確かめる(UnityTest) |

## つまずきやすい点

- ロジックを、MonoBehaviourから分けておくと、Edit Modeでテストしやすい
- Play Modeのテストは、遅くなりやすい。重要な部分に絞る
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using NUnit.Framework;

public class DamageTests
{
    [Test]
    public void Damage_ReducesHp()
    {
        int hp = 100;
        hp -= 30;
        Assert.AreEqual(70, hp);
    }
}
```
