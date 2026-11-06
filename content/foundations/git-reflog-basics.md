---
name: "git reflogで失った作業を取り戻す"
category: IT知識
subcategory: "バージョン管理"
summary: "HEADがどこを指してきたかの履歴(reflog)を見れば、resetなどで消えたコミットを探して戻せる。"
claim: "reflogは、HEADの移動の記録。消えたように見えるコミットを探せる。"
operationSteps:
  - label: "コミットが見えなくなる"
    note: "reset --hard やブランチの削除などで、コミットが履歴から消えたように見える"
  - label: "reflogを表示する"
    note: "`git reflog` で、HEADがこれまでに指した場所の履歴を見る"
  - label: "戻りたい時点を探す"
    note: "各行のコミットIDと操作の内容から、戻りたい時点を見つける"
  - label: "そのコミットへ戻る"
    note: "`git reset --hard ID` や、`git switch -c 新ブランチ ID` で、その状態を取り戻す"
  - label: "早めに行う"
    note: "reflogの記録は、一定期間が過ぎると整理される。気づいたら、早めに戻す"
quiz:
  - question: "reflogに記録されるものはどれか"
    choices:
      - "HEADが指してきた場所の履歴"
      - "リモートのすべてのブランチ"
      - "コミットしていない変更"
    answer: 0
    explanation: "コミットしていない変更は、reflogには残らない。"
---

## 概要

gitは、ブランチを巻き戻したあとも、コミットのデータをしばらく残している。そこへたどり着くための手がかりが**reflog**で、HEADが指した場所の履歴を、ローカルに記録している。操作を誤って消してしまったコミットを、取り戻すのに使う。

## 基礎文法

| コマンド | 意味 |
| --- | --- |
| git reflog | HEADの移動の履歴を表示する |
| git reset --hard ID | 指定したコミットへ戻す(作業ツリーも変わる) |
| git switch -c 名前 ID | そのコミットから、新しいブランチを作る |

## つまずきやすい点

- reflogは、自分のローカルのリポジトリだけの記録。他人のリポジトリや、クローン直後の状態にはない
- 記録は永久ではない。長い時間が経つと、整理されて、戻せなくなる
- コミットしていない変更は、reflogにも残らない。こまめにコミットしておく

## 実装例(コード)

```bash
git reflog
# 例: a1b2c3d HEAD@{2}: commit: 機能Aを追加
git switch -c recovered a1b2c3d
```
