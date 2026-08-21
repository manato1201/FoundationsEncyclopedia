---
name: git stashの基礎
category: IT知識
subcategory: バージョン管理
summary: 作業中の変更を一時的に退避させ、コミットせずに別の作業へ切り替えられるようにするコマンド。
operationSteps:
  - label: 作業中の変更をstashで退避する
    menuPath: "git stash"
  - label: 別のブランチへ切り替えて作業する
    note: 作業ディレクトリはクリーンな状態(直前のコミット時点)に戻る
  - label: 元のブランチへ戻る
  - label: stash popで退避した変更を復元する
    menuPath: "git stash pop"
---

## 概要

`git stash`は、作業ディレクトリの未コミットの変更を一時的な「退避場所」に保存し、作業ディレクトリをクリーンな状態(直前のコミット時点)に戻すコマンド。急ぎのバグ修正のために別のブランチへ切り替えたいが、今の作業をまだコミットしたくない、という場面で使う。

## 基礎文法

```bash
git stash            # 現在の変更を退避する
git checkout other-branch
# 別の作業をする...
git checkout original-branch
git stash pop         # 退避した変更を元に戻し、stashリストから削除する
```

- `git stash list`: 退避した変更の一覧を確認する
- `git stash apply`: 変更を戻すが、stashリストからは削除しない(`pop`との違い)
- `git stash drop`: stashリストから特定の退避内容を削除する

## つまずきやすい点

- 複数回`stash`すると、どのstashがどの作業の内容だったか分からなくなりやすい。`git stash save "作業内容のメモ"`のようにメッセージを付けておくと後で識別しやすい
- `stash pop`はコンフリクトが起きる可能性がある(退避した後に元のブランチが変更されていた場合等)。コンフリクトが起きた場合、`pop`は失敗し、stashの内容はリストに残ったままになる(意図せず二重に適用してしまうミスを避けるため)
- 新規に追加した未追跡ファイル(`git add`していないファイル)は、デフォルトでは`stash`の対象に含まれない。含めたい場合は`git stash -u`(untrackedも含める)オプションが必要

## 実装例(コード)

```bash
git stash -u                    # 未追跡ファイルも含めて退避
git stash list                  # stash@{0}: WIP on main: ...
git stash apply stash@{0}       # 特定のstashを指定して適用
```
