---
name: データテーブルの基礎
category: ツール別
subcategory: UnrealEngine
summary: CSVやスプレッドシートに近い表形式で、大量のゲームデータ(敵のステータス等)を管理する仕組み。
---

## 概要

Unreal Engineのデータテーブルは、行(ID)と列(属性値)からなる表形式で、大量のゲームデータを一括管理する仕組み。敵のステータス一覧、アイテムのパラメータ一覧のような「同じ形のデータが多数並ぶ」情報の管理に向いており、[Unity ScriptableObjectの使いどころ](/foundations/unity-scriptable-object-basics)がオブジェクト単位でデータを持つのに対し、データテーブルは表形式で大量のデータをまとめて扱う点が特徴的。

## 基礎文法

```cpp
// C++側でデータテーブルの行構造(スキーマ)を定義する
USTRUCT(BlueprintType)
struct FEnemyStatRow : public FTableRowBase
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere) FString DisplayName;
    UPROPERTY(EditAnywhere) int32 MaxHealth;
    UPROPERTY(EditAnywhere) float MoveSpeed;
};
```

データテーブルはCSVファイルからインポートすることもでき、エクセルやスプレッドシートでデータを編集し、まとめて取り込むワークフローがよく使われる。

## つまずきやすい点

- データテーブルの行構造(スキーマ)を後から変更する(列を追加・削除する)と、既存のデータ(特にCSVで管理している場合)との整合性が崩れることがある。運用が始まった後のスキーマ変更は、影響範囲を確認しながら慎重に行う必要がある
- データテーブルの参照は行の「名前」(RowName)を文字列で指定する形になっており、[SQLインジェクションの基礎](/foundations/sql-injection-basics)のような直接的な脆弱性はないが、タイプミスによる参照ミスがコンパイル時に検出されないことがある。定数化するか、専用のヘルパー関数を経由するといった対策が実務的
- 大量の行を持つデータテーブルをゲームの起動時に全て読み込むと、起動時間に影響することがある。本当に必要なデータだけを必要なタイミングで読み込む設計([Addressablesの基礎](/foundations/unity-addressables-basics)にも通じる考え方)が重要になる場合がある

## 実装例(コード)

```cpp
// データテーブルから特定の行を検索する例
FEnemyStatRow* Row = EnemyStatTable->FindRow<FEnemyStatRow>(TEXT("Slime"), TEXT(""));
```
