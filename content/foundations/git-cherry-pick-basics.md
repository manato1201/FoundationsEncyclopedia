---
name: git cherry-pickの基礎
category: IT知識
subcategory: バージョン管理
summary: 別のブランチにある特定のコミットだけを、いまのブランチにコピーして取り込む。
claim: "cherry-pickは、必要なコミットだけを、別のブランチへ持ってくる。"
operationSteps:
  - label: 取り込みたいコミットを探す
    note: "git log で、別のブランチにあるコミットのIDを調べる"
  - label: 取り込み先のブランチに移る
    note: "git switch でブランチを切り替える"
  - label: cherry-pick を実行する
    note: "git cherry-pick コミットID で、そのコミットの変更を、新しいコミットとして追加する"
  - label: 競合を解決する
    note: 変更が重なっていると競合する。解決して、続行する(git cherry-pick --continue)
  - label: 結果を確認する
    note: 内容は同じでも、コミットIDは別物になる。履歴で確認する
quiz:
  - question: "cherry-pickしたコミットのIDについて正しいものはどれか"
    choices:
      - "元のコミットと同じIDになる"
      - "内容は同じでも、新しいコミットIDになる"
      - "IDは作られない"
    answer: 1
    explanation: "変更をコピーして新しいコミットを作るため、IDは元と別になる。"
---

## 概要

**git cherry-pick**は、別のブランチにある特定のコミットの変更を、いまのブランチに新しいコミットとして取り込む。ブランチ全体を取り込む `merge` と違い、必要なコミットだけを選べる。たとえば、リリース用のブランチに、バグ修正のコミットだけを入れたいときに使う。

## 基礎文法

| コマンド | 意味 |
| --- | --- |
| `git cherry-pick ID` | 指定したコミットを取り込む |
| `git cherry-pick A..B` | 範囲を指定して、複数のコミットを取り込む |
| `git cherry-pick --continue` | 競合を解決したあとで続行する |
| `git cherry-pick --abort` | 取り込みを中止して、元に戻す |

## つまずきやすい点

- 内容は同じでも、コミットIDは別になる。のちにブランチを`merge`すると、同じ変更が二重に見える場合がある
- 前のコミットに依存する変更だけを取り込むと、競合したり、動かなかったりする。必要なコミットを揃える
- 多用すると、どのブランチに何が入っているか追いにくくなる。通常の統合は、merge や rebase を使う

## 実装例(コード)

```bash
git log feature --oneline          # 取り込みたいコミットのIDを調べる
git switch release
git cherry-pick a1b2c3d            # そのコミットの変更だけを取り込む
```
