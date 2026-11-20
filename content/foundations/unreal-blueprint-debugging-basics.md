---
name: "Blueprintのデバッグの基礎(Unreal Engine)"
category: ツール別
subcategory: "UnrealEngine"
summary: "Print String で値を表示し、ブレークポイントで処理を止めて、変数や実行の流れを確かめる。"
claim: "動かない原因は、推測せず、値と実行の流れを見て探す。"
operationSteps:
  - label: "Print Stringで表示"
    note: "確かめたいノードの後に Print String をつなぐと、画面と Output Log に、文字が表示される"
  - label: "ブレークポイントを置く"
    note: "ノードを選んで F9 を押すと、そこで処理が止まるようになる(赤い印が付く)"
  - label: "ゲームを実行して止める"
    note: "Play すると、そのノードの実行直前で止まる。実行の流れが、ハイライトで示される"
  - label: "値と流れを確かめる"
    note: "ピンやWatchに、その時点の変数の値が表示される。Debug Object で、確認するインスタンスを選ぶ"
  - label: "1つずつ進める"
    note: "F10 で次のノードへ進める。F11 で呼び出した関数の中へ入る。F8 で再開する"
quiz:
  - question: "Blueprintのノードにブレークポイントを置くキーはどれか(既定)"
    choices:
      - "F5"
      - "F9"
      - "F10"
    answer: 1
    explanation: "F9 は、ブレークポイントの切り替え。F10 は次のノードへ進む(ステップオーバー)。"
---

## 概要

Blueprintで組んだ処理が、期待どおりに動かないとき、原因は、実行されていない・値が違う・対象のインスタンスが違う、のどれかが多い。**Print String**で値を表示する簡単な方法と、**ブレークポイント**で処理を止めて中を見る方法の、2つを使い分けて、事実を確かめる。Blueprintの基本は、[Blueprintでのイベント駆動処理](/foundations/unreal-blueprint-basics)を参照。

## 基礎文法

| 方法 | 使いどころ |
| --- | --- |
| Print String | 値の確認、処理が通ったかの確認 |
| ブレークポイント(F9) | 特定のノードで止めて、状態を調べる |
| ステップ実行(F10・F11) | 1ノードずつ、流れを追う |
| Watch | 変数の値を、継続して見る |
| Output Log | 警告・エラーの確認 |

- ブレークポイントで止まっている間に、実行中のBlueprintの値を、ピンにマウスを重ねて確かめられる
- 複数のインスタンスがあるときは、デバッグ対象を、エディターの Debug Object の選択で決める

## つまずきやすい点

- ブレークポイントを置いたノードが、一度も実行されなければ、止まらない。止まらないこと自体が、「そこに到達していない」という情報になる
- 複数のActorが、同じBlueprintを使っているとき、別のインスタンスの値を見ていることがある。Debug Object で、見たい対象を選ぶ
- Print String を残したまま、出荷しない。確認が終わったら、削除する
- 「Accessed None」の警告は、参照が空のまま使われている。参照を設定している場所が、先に実行されているかを、確かめる

## 実装例(コード)

```cpp
// C++ 側で、同じ確認をする場合
UE_LOG(LogTemp, Warning, TEXT("Health = %f"), Health);       // Output Log に出す

if (GEngine)
{
    GEngine->AddOnScreenDebugMessage(
        -1, 2.0f, FColor::Yellow, TEXT("Hit"));              // 画面に2秒表示する
}
```
