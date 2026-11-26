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
visual:
  kind: graph
  question: "統合したあと、履歴はどんな形になる?"
  legend:
    - { key: base, label: "main のコミット", tone: blue, mark: "m" }
    - { key: feat, label: "feature のコミット", tone: green, mark: "f" }
    - { key: merge, label: "マージコミット", tone: amber, mark: "+" }
    - { key: rewritten, label: "積み直したコミット(新しいハッシュ)", tone: violet, mark: "新" }
    - { key: old, label: "書き換え前のコミット", tone: gray, mark: "旧" }
    - { key: shared, label: "push 済みで仲間も持つ", tone: pink, mark: "!" }
  nodes:
    - { id: mA, label: "A", x: 5, y: 10 }
    - { id: mB, label: "B", x: 22, y: 10 }
    - { id: mC, label: "C", x: 45, y: 10 }
    - { id: mM, label: "M", x: 85, y: 10 }
    - { id: mF1, label: "F1", x: 40, y: 40 }
    - { id: mF2, label: "F2", x: 62, y: 40 }
    - { id: rA, label: "A", x: 5, y: 70 }
    - { id: rB, label: "B", x: 22, y: 70 }
    - { id: rC, label: "C", x: 45, y: 70 }
    - { id: rN1, label: "F1'", x: 65, y: 70, hidden: true }
    - { id: rN2, label: "F2'", x: 85, y: 70, hidden: true }
    - { id: rF1, label: "F1", x: 35, y: 100 }
    - { id: rF2, label: "F2", x: 52, y: 100 }
  edges:
    - { from: mA, to: mB }
    - { from: mB, to: mC }
    - { from: mC, to: mM }
    - { from: mB, to: mF1 }
    - { from: mF1, to: mF2 }
    - { from: mF2, to: mM }
    - { from: rA, to: rB }
    - { from: rB, to: rC }
    - { from: rC, to: rN1, hidden: true }
    - { from: rN1, to: rN2, hidden: true }
    - { from: rB, to: rF1 }
    - { from: rF1, to: rF2 }
  steps:
    - short: "merge"
      nodes: { mA: base, mB: base, mC: base, mF1: feat, mF2: feat, mM: merge, rA: base, rB: base, rC: base, rF1: feat, rF2: feat }
      edges: { "mA>mB": base, "mB>mC": base, "mB>mF1": feat, "mF1>mF2": feat, "mC>mM": merge, "mF2>mM": merge, "rA>rB": base, "rB>rC": base, "rB>rF1": feat, "rF1>rF2": feat }
      notes: { mA: "merge 側", rA: "rebase 側" }
      focus: [mM]
      verdict: "merge は合流点 M を作り、枝分かれした履歴をそのまま残す"
    - short: "rebase"
      nodes: { rN1: rewritten, rN2: rewritten, rF1: old, rF2: old }
      edges: { "rC>rN1": rewritten, "rN1>rN2": rewritten, "rB>rF1": old, "rF1>rF2": old }
      focus: [rN1, rN2]
      verdict: "rebase は F1・F2 を C の後ろに作り直す(ハッシュが変わる)"
    - short: "見た目"
      notes: { mM: "枝分かれ", rN2: "一直線" }
      focus: [mM, rN2]
      verdict: "merge は枝分かれが増え、rebase は一直線で読みやすい"
    - short: "共有ブランチ"
      nodes: { rF1: shared, rF2: shared }
      edges: { "rB>rF1": shared, "rF1>rF2": shared }
      notes: { rF2: "仲間が持つ" }
      focus: [rF1, rF2]
      verdict: "× push 済みの履歴を書き換えると、仲間の履歴と食い違う"
  summary:
    title: "残すか、一直線にするか"
    columns: ["merge", "rebase"]
    rows:
      - { label: "履歴", cells: ["両方をそのまま残す", "先端に積み直して一直線"] }
      - { label: "元のコミット", cells: ["そのまま+マージコミット", "作り直す(ハッシュが変わる)"] }
      - { label: "読みやすさ", cells: ["△ 枝分かれが増える", "○ 一直線で読みやすい"] }
      - { label: "分岐の記録", cells: ["○ いつ分かれたか残る", "× 失われる"] }
      - { label: "コンフリクト", cells: ["○ まとめて解決", "△ コミットごとに解決することがある"] }
      - { label: "push 済みのブランチ", cells: ["○ 使える", "× 避ける"] }
    note: "rebase は、まだ自分だけが触っているローカルのブランチに限ると安全。"
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
