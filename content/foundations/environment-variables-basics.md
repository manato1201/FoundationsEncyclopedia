---
name: 環境変数の基礎
category: IT知識
subcategory: Linux・シェル操作
masteryBadge: done
summary: OSやシェルがプロセスに渡す、キーと値のペアの集合。設定やAPIキーの受け渡しに広く使われる。
---

## 概要

環境変数は、OSやシェルが実行中のプロセスに渡す、キーと値のペアの集合。プログラムのコード自体を変更せずに、動作環境(開発/本番の切り替え、APIキーの受け渡し等)を外部から設定できるようにする仕組みとして広く使われている。

## 基礎文法

```bash
export API_KEY="secret123"   # 環境変数を設定する(このシェルセッション以降で有効)
echo $API_KEY                 # 環境変数の値を参照する

API_KEY=secret123 npm start   # そのコマンド実行時だけ有効な一時的な環境変数
```

```javascript
// Node.jsから環境変数を読み取る例
const apiKey = process.env.API_KEY;
```

## つまずきやすい点

- APIキーやパスワードのような秘密情報を環境変数で管理する運用は一般的だが、`.env`ファイル自体を[バージョン管理から除外](/foundations/gitignore-basics)し忘れると、秘密情報がリポジトリに残ってしまう
- `export`せずに変数を設定した場合(`API_KEY=secret123`のみ)、そのシェル自身では参照できても、そこから起動した子プロセス(npmスクリプト等)には引き継がれない。環境変数として子プロセスにも渡したい場合は`export`が必要
- 開発環境と本番環境で同じ名前の環境変数に異なる値を設定するのはよくある運用だが、設定を切り替え忘れると、開発用のAPIキーのまま本番環境で動かしてしまうといった事故につながる。環境ごとに設定ファイル(`.env.development`、`.env.production`等)を分けて管理するのが安全

## 実装例(コード)

```bash
# .env ファイルの例(直接コミットせず、.gitignoreで除外する)
DATABASE_URL=postgresql://localhost/mydb
API_KEY=secret123
```
