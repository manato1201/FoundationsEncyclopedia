---
name: "GitHub Actionsのワークフローの基礎"
category: Framework
subcategory: "テスト・CI"
summary: "リポジトリ内の YAML ファイルに「いつ・どこで・何を実行するか」を書くと、push などをきっかけに、テストやビルドを自動で実行できる。"
claim: "ワークフローは、きっかけ(on)・ジョブ(jobs)・手順(steps)の3段で書く。"
operationSteps:
  - label: "YAMLファイルを置く"
    note: "`.github/workflows/` の下に、ファイル(例: ci.yml)を作る。リポジトリに含めてコミットする"
  - label: "きっかけ(on)を決める"
    note: "`on: [push, pull_request]` のように、実行するタイミングを書く"
  - label: "ジョブと実行環境を決める"
    note: "`jobs:` の下にジョブを書き、`runs-on: ubuntu-latest` で、実行するマシンの種類を選ぶ"
  - label: "手順(steps)を並べる"
    note: "`uses:` で、ほかの人が作った部品(例: コードの取得)を呼び、`run:` でコマンドを実行する"
  - label: "結果を確認する"
    note: "GitHub の Actions タブに、各手順のログと成否が表示される。失敗した手順で止まる"
quiz:
  - question: "ワークフローの YAML ファイルは、どこに置くか"
    choices:
      - "リポジトリの docs/"
      - ".github/workflows/"
      - "リポジトリの .git/"
    answer: 1
    explanation: "GitHub は、.github/workflows/ の下のYAMLファイルを、ワークフローとして読み込む。"
---

## 概要

**GitHub Actions**は、GitHubのリポジトリで動くCI/CDの仕組み([CIパイプラインの基本ステージ](/foundations/ci-pipeline-basics))。やることを**ワークフロー**というYAMLファイルに書いておくと、pushやプルリクエストなどの出来事(イベント)をきっかけに、GitHubが用意したマシン上で自動実行する。結果はプルリクエストにも表示されるので、テストを通らないコードの混入を防げる。

## 基礎文法

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4      # コードを取得する
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci                    # 依存関係をインストールする
      - run: npm test                  # テストを実行する
```

| 用語 | 意味 |
| --- | --- |
| workflow | 1つのYAMLファイルで定義する自動処理 |
| job | 同じマシン上で行う、手順のまとまり。ジョブどうしは、既定で並行して動く |
| step | ジョブ内の1つの手順。`uses`(部品)か`run`(コマンド) |
| runner | ジョブを実行するマシン(`runs-on`で選ぶ) |

## つまずきやすい点

- YAMLはインデント(字下げ)が意味を持つ。字下げがずれると、ワークフローが読み込まれない
- ジョブごとに、新しいマシンが用意される。ジョブをまたいで、ファイルは引き継がれない(必要なら、成果物のアップロードなどを使う)
- `uses:`で指定する部品のバージョン(`@v4`)は、更新される。使う前に、公式の最新の案内を確認する。重要なワークフローでは、版を固定する
- 秘密の値(APIキーなど)は、YAMLに直接書かず、リポジトリの Secrets に登録して参照する([シークレット管理の基礎](/foundations/secrets-management-basics))

## 実装例(コード)

```yaml
name: Lint and Test
on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "ここで lint や test を実行する"
      - run: |
          echo "複数行の"
          echo "コマンドも書ける"
```
