---
name: 仮想環境(venv)の基礎
category: プログラミング言語
subcategory: Python
masteryBadge: done
summary: プロジェクトごとに独立したパッケージ環境を作り、依存関係の衝突を防ぐ仕組み。
---

## 概要

仮想環境(virtual environment)は、システム全体にインストールされたPythonとは別に、プロジェクト専用のパッケージインストール先を作る仕組み。プロジェクトAとBで同じライブラリの異なるバージョンが必要な場合でも、それぞれ独立した仮想環境を使えば衝突しない。

## 基礎文法

```bash
python -m venv .venv        # .venvディレクトリに仮想環境を作成
source .venv/bin/activate   # 有効化(Windowsは .venv\Scripts\activate)
pip install requests        # この仮想環境の中だけにインストールされる
pip freeze > requirements.txt  # インストール済みパッケージ一覧を書き出す
deactivate                  # 仮想環境を抜ける
```

- `requirements.txt`をリポジトリにコミットしておくと、他の開発者が`pip install -r requirements.txt`で同じ依存関係を再現できる

## つまずきやすい点

- 仮想環境を有効化(activate)し忘れたままpip installすると、システム全体のPython環境にインストールされてしまい、プロジェクト間の依存関係が汚染される
- `.venv`ディレクトリ自体をGitにコミットしてしまうと、OSやアーキテクチャに依存したバイナリが含まれるため他の環境で動かない。`.gitignore`で除外し、`requirements.txt`だけを共有するのが定石
- `uv`や`poetry`のような比較的新しいツールは、仮想環境の作成・依存解決・ロックファイル管理をまとめて行う。`venv`+`pip`の素朴な組み合わせより高速・再現性が高いことが多い

## 実装例(コード)

```bash
# uvを使う場合の同等の操作例
uv venv
uv pip install requests
uv pip freeze > requirements.txt
```
