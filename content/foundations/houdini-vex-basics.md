---
name: HoudiniのVEXの基礎(Point Wrangle)
category: DCC
subcategory: Houdini
summary: ポイントごとにコードを実行してアトリビュートを操作する、Houdiniのプロシージャル処理の中核。
operationSteps:
  - label: Point Wrangle SOPを作成
    menuPath: Tab検索 > Attribute Wrangle
    note: Run Over を Points に設定するとポイント単位で処理される
  - label: VEXコードを記述する
    note: "例: @P.y += sin(@P.x) * 0.5; のように@Pなどのアトリビュートに直接代入する"
  - label: アトリビュートを確認する
    menuPath: Geometry Spreadsheet
    note: 計算結果のアトリビュート値を数値で確認しながらデバッグできる
  - label: 上流ノードと接続してネットワーク化する
    note: 他のSOPと組み合わせることで、手続き的に再利用可能な処理チェーンになる
---

## 概要

VEX(Vector Expression)は、Houdiniのジオメトリノード内で使われる高速なプログラミング言語。Point Wrangleノードを使うと、メッシュの各ポイントに対して同じVEXコードを並列的に実行し、位置やカラーなどのアトリビュートを一括で操作できる。

## 操作手順(OperationSteps)

frontmatterの`operationSteps`に記載した4手順が、詳細ページのCSSステップアニメーションと連動して表示されます。

## つまずきやすい点

- `@P`(位置)や`@N`(法線)といった組み込みアトリビュートの意味を理解せずに書くと、意図しない形状の破綻につながる
- VEXはポイントごとに並列実行される前提のため、「前のポイントの計算結果を参照する」ような逐次処理はそのままでは書けない(Runover設定やForループノードなど別の仕組みが必要)
- ノードベースのプロシージャル処理という思想上、VEXコードだけを単体で理解しようとせず、上流・下流のノードとの接続関係も含めて全体のデータフローを把握することが重要
