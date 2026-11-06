---
name: "パッケージマネージャーの基礎(apt)"
category: IT知識
subcategory: "Linux・シェル操作"
summary: "ソフトウェアの入手・インストール・更新・削除を、まとめて管理する仕組み。"
claim: "パッケージマネージャーは、ソフトの入手から更新までを、依存関係ごと管理する。"
operationSteps:
  - label: "パッケージの一覧を更新する"
    note: "`apt update` で、入手できるパッケージの最新の情報を取得する"
  - label: "パッケージを探す"
    note: "`apt search 名前` で、目的のパッケージを探す"
  - label: "インストールする"
    note: "`apt install 名前` で、必要な依存パッケージもまとめて入れる"
  - label: "更新する"
    note: "`apt upgrade` で、入っているパッケージを、新しい版へ上げる"
  - label: "不要になったら削除する"
    note: "`apt remove 名前` で、削除する。使わなくなった依存は、`apt autoremove` で整理する"
quiz:
  - question: "パッケージの最新情報を取得するaptのコマンドはどれか"
    choices:
      - "apt update"
      - "apt remove"
      - "apt autoremove"
    answer: 0
    explanation: "updateは一覧の更新、upgradeは入っているものの更新。"
---

## 概要

**パッケージマネージャー**は、ソフトウェアの入手・インストール・更新・削除を、**依存関係も含めて**まとめて管理する仕組み。DebianやUbuntuでは**apt**、Red Hat系では**dnf**、macOSでは**Homebrew**などが使われる。

## 基礎文法

| 操作 | aptのコマンド |
| --- | --- |
| 情報の更新 | `sudo apt update` |
| インストール | `sudo apt install 名前` |
| 更新 | `sudo apt upgrade` |
| 削除 | `sudo apt remove 名前` |

## つまずきやすい点

- インストールの前に、`apt update` で一覧を更新する。古い情報のままだと、見つからない場合がある
- 管理者の権限(`sudo`)が必要。実行する内容を確認してから行う
- 公式のリポジトリ以外のパッケージは、出所を確認する。信頼できないものを入れない

## 実装例(コード)

```bash
sudo apt update
sudo apt install git
git --version
```
