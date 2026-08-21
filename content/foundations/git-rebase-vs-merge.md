---
name: rebaseとmergeの違い
category: IT知識
subcategory: バージョン管理
masteryBadge: review
summary: ブランチの変更を統合する2つの方法。履歴を残すか、書き換えて一直線にするかという設計思想の違い。
operationSteps:
  - label: mergeは両方の履歴を残す
    note: マージコミットが作られ、枝分かれした履歴がそのまま残る
  - label: rebaseはコミットを積み直す
    note: featureのコミットをmainの先端に付け替え、履歴が一直線になる
  - label: 履歴の見た目を比較する
    note: mergeは枝分かれだらけ、rebaseは一直線で読みやすい
  - label: 共有ブランチではrebaseを避ける
    note: 既にpush済みの履歴を書き換えると、共同作業者の履歴と食い違う
---

## 概要

`git merge`と`git rebase`は、どちらもあるブランチの変更を別のブランチへ統合するためのコマンドだが、結果として残るコミット履歴の形が大きく異なる。mergeは両方の履歴をそのまま残して合流点(マージコミット)を作るのに対し、rebaseは片方の履歴を書き換えて、もう片方の先端に「積み直す」。

## 基礎文法

```bash
# merge: featureの変更をmainに統合し、マージコミットが作られる
git checkout main
git merge feature

# rebase: featureのコミットをmainの先端に積み直し、履歴が一直線になる
git checkout feature
git rebase main
git checkout main
git merge feature # このmergeはfast-forwardになりマージコミットは作られない
```

## つまずきやすい点

- rebaseは元のコミットのハッシュ値を変える(新しいコミットとして作り直す)。既に他の人と共有・push済みのブランチをrebaseすると、共有先の履歴と食い違いが生じ、force pushが必要になったり、共同作業者の履歴を壊したりする。「まだ自分だけが触っているローカルブランチ」に限定して使うのが安全
- mergeは履歴が正確に残る代わりに、機能追加のたびにマージコミットが増え、`git log`の履歴が枝分かれだらけで追いにくくなることがある。rebaseは一直線の履歴になり読みやすい反面、「実際にどの時点でどう分岐していたか」という情報は失われる
- rebase中にコンフリクトが発生すると、mergeと違って「コミットごとに」コンフリクト解決を求められることがある。コミット数が多いfeatureブランチをrebaseすると、同じような解決作業を何度も繰り返す羽目になることがある

## 実装例(コード)

```bash
# rebase中にコンフリクトが起きた場合の対処
git status         # コンフリクトしているファイルを確認
# ファイルを編集して解決
git add <ファイル>
git rebase --continue
```
