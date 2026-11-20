---
name: "Gitのステージングエリアの基礎"
category: IT知識
subcategory: "バージョン管理"
summary: "Gitは「作業ツリー」「ステージングエリア」「リポジトリ」の3つの場所を使い分ける。add で次のコミットに入れる変更を選び、commit で確定する。"
claim: "commit するのは、作業ツリー全部ではなく、add でステージングした変更だけ。"
operationSteps:
  - label: "作業ツリーでファイルを編集する"
    note: "ふだんファイルを書き換える場所。変更はまだGitに記録されていない"
  - label: "git statusで確認"
    note: "「ステージされていない変更」と「コミット予定の変更」が、別々に表示される"
  - label: "git addでステージングする"
    note: "`git add 名前` で、次のコミットに入れる変更を選ぶ。ここで内容が一時保管される"
  - label: "ステージの中身を確認する"
    note: "`git diff --staged` は、ステージ済みの変更だけを表示する。`git diff` だけだと、ステージ前の変更が見える"
  - label: "git commitで確定する"
    note: "ステージにあった変更だけが、1つのコミットとしてリポジトリに記録される"
quiz:
  - question: "ステージングしたファイルを、ステージから外す(編集内容は残す)コマンドはどれか"
    choices:
      - "git commit --amend"
      - "git stash drop"
      - "git restore --staged ファイル名"
    answer: 2
    explanation: "restore --staged は、ステージだけを取り消し、作業ツリーの編集内容は変えない。"
---

## 概要

Gitには、変更が通る場所が3つある。ファイルを編集する**作業ツリー**、次のコミットに入れる内容を並べる**ステージングエリア**(インデックスとも呼ぶ)、確定した履歴を持つ**リポジトリ**。この中間のステージングがあるおかげで、「たくさん編集したうち、関係ある変更だけを1つのコミットにする」ことができる。

## 基礎文法

| コマンド | 意味 |
| --- | --- |
| git status | 3つの場所の状態を確認する |
| git add ファイル | 作業ツリーの変更を、ステージに入れる |
| git add -p | 変更の一部分(ハンク)ごとに、入れるかを選ぶ |
| git restore --staged ファイル | ステージから外す(編集内容は残る) |
| git diff / git diff --staged | 作業ツリーとステージの差 / ステージと最新コミットの差 |
| git commit -m "説明" | ステージの内容をコミットにする |

## つまずきやすい点

- `git add`のあとにファイルをさらに編集すると、その編集分はステージに入っていない。コミットされるのは、`add`した時点の内容
- `git diff`で何も出ないのに、変更があるように見えるときは、すでにステージ済みのことが多い。`git diff --staged`を試す
- `git add .`は、カレントディレクトリ以下の全部を入れる。`.gitignore`に書いていない不要なファイルを入れないよう、`status`で確かめる
- `git restore ファイル`(`--staged`なし)は、作業ツリーの編集を捨てる。取り戻せないことがあるので注意する

## 実装例(コード)

```bash
git init demo && cd demo
echo "a" > a.txt
echo "b" > b.txt
git add a.txt                 # a.txt だけをステージ
git status --short            # A  a.txt / ?? b.txt
git commit -m "add a.txt"     # b.txt は含まれない
git add b.txt
git restore --staged b.txt    # やっぱり外す
git status --short            # ?? b.txt
```
