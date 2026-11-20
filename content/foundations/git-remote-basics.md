---
name: "リモートリポジトリの基礎(clone・fetch・pull・push)"
category: IT知識
subcategory: "バージョン管理"
summary: "GitHubなどにあるリポジトリ(リモート)と、手元のリポジトリの間で、履歴を受け取る・送る操作。"
claim: "fetch は受け取るだけ、pull は受け取って統合する、push は送る。"
operationSteps:
  - label: "cloneで手元に複製する"
    note: "`git clone URL` は、リモートの履歴をすべて受け取り、`origin` という名前で、接続先を記録する"
  - label: "手元でコミットを重ねる"
    note: "コミットは、まず手元のリポジトリにだけ増える。リモートには、まだ届いていない"
  - label: "fetchで更新を確認する"
    note: "`git fetch` は、リモートの新しいコミットを受け取るが、手元のブランチは動かさない"
  - label: "pullで取り込む"
    note: "`git pull` は、fetch に続けて、手元のブランチに統合する(既定は merge)"
  - label: "pushで手元の履歴を送る"
    note: "`git push` で、手元のコミットをリモートへ送る。リモートに新しい更新があると、拒否される"
quiz:
  - question: "git fetch の説明として正しいものはどれか"
    choices:
      - "リモートの更新を受け取り、自動で手元に統合する"
      - "手元のコミットをリモートに送る"
      - "リモートの更新を受け取るが、手元のブランチは変えない"
    answer: 2
    explanation: "統合まで行うのは pull。fetch は受け取るだけなので、内容を確認してから取り込める。"
---

## 概要

Gitは、各自の手元に履歴の完全なコピーを持つ分散型のしくみ。チームで共有するときは、GitHubなどに置いた共有用のリポジトリを**リモート**と呼び、手元のリポジトリとの間で履歴をやり取りする。リモートの標準的な名前は`origin`。

## 基礎文法

| コマンド | 向き | 手元のブランチへの影響 |
| --- | --- | --- |
| git clone URL | リモート → 手元 | 新しいリポジトリを作る |
| git fetch | リモート → 手元 | 変えない(`origin/main`などの記録だけ更新) |
| git pull | リモート → 手元 | 取り込んで進める |
| git push | 手元 → リモート | 変えない(リモートが進む) |

- `git remote -v`で、登録されているリモートとURLを確認できる
- `git push -u origin main`の`-u`は、手元の`main`の送り先(上流)を`origin/main`と記録する。次回から`git push`だけで済む
- 統合の方法は[rebaseとmergeの違い](/foundations/git-rebase-vs-merge)、衝突したときは[マージコンフリクトの解決](/foundations/git-conflict-resolution)を参照

## つまずきやすい点

- `push`が「rejected」で断られるのは、リモートに自分の知らないコミットがあるため。先に`fetch`か`pull`で取り込んで、統合してから送り直す
- `git push --force`は、リモートの履歴を上書きする。共有しているブランチに使うと、ほかの人の作業を消すことがある。使うなら`--force-with-lease`を選ぶ
- `origin/main`は、「最後に確認したときのリモートの状態」で、リアルタイムではない。最新を見るには`fetch`が必要
- `pull`の動作(merge か rebase か)は設定で変わる。意図しない統合を避けるため、設定を確認しておく

## 実装例(コード)

```bash
git remote add origin https://github.com/example/demo.git
git remote -v                  # origin の URL を確認
git push -u origin main        # 初回: 送り先を記録して送る

git fetch                      # 更新を受け取る(手元のブランチは動かない)
git log --oneline main..origin/main   # リモートにだけあるコミットを見る
git pull                       # 取り込んで統合する
```
