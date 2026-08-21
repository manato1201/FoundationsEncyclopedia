---
name: Dockerfileの基礎
category: IT知識
subcategory: コンテナ・仮想化
summary: どのようにコンテナイメージを組み立てるかを記述する、テキストベースのビルド手順書。
operationSteps:
  - label: ベースイメージを指定する
    menuPath: "FROM node:20-alpine"
  - label: 依存関係だけ先にコピーしインストールする
    menuPath: "COPY package.json ./  RUN npm install"
    note: この順序によりコード変更時のキャッシュ再利用が効きやすくなる
  - label: 残りのアプリケーションコードをコピーする
    menuPath: "COPY . ."
  - label: 起動コマンドを指定する
    menuPath: "CMD [\"npm\", \"start\"]"
---

## 概要

Dockerfileは、[Dockerの基礎](/foundations/docker-basics)で扱った「イメージ」をどう組み立てるかを記述する、テキストベースのビルド手順書。ベースとなるOS・ランタイムの選択から、依存関係のインストール、アプリケーションのコピー、起動コマンドまでを1つのファイルに記述する。

## 基礎文法

```dockerfile
FROM node:20-alpine       # ベースイメージ(軽量なAlpine Linux上のNode.js)
WORKDIR /app               # 以降のコマンドの作業ディレクトリ
COPY package*.json ./      # 依存関係の定義ファイルだけ先にコピー
RUN npm install             # 依存関係をインストール
COPY . .                    # 残りのアプリケーションコードをコピー
EXPOSE 3000                 # コンテナが使うポートを明示(ドキュメント的な意味合い)
CMD ["npm", "start"]        # コンテナ起動時に実行するコマンド
```

## つまずきやすい点

- `COPY package*.json ./`と`COPY . .`を分けて書いているのは、[コンテナイメージのレイヤー構造](/foundations/container-image-layers)を活かしたキャッシュ最適化のため。依存関係を先にインストールしておけば、アプリケーションコードだけを変更した際に`npm install`のレイヤーを再実行せずに済む。この順序を意識しないと、コードを1行変えるだけで毎回全ての依存関係を再インストールする羽目になる
- `RUN`命令を細かく分けすぎると、イメージのレイヤー数が増えてサイズが肥大化することがある。関連するコマンドは`&&`で1つの`RUN`にまとめるのが一般的なプラクティス
- 開発用の設定(デバッグツール、テスト用のライブラリ等)をそのまま本番用イメージに含めてしまうと、イメージサイズの肥大化やセキュリティリスクの増加につながる。マルチステージビルド(ビルド専用のステージと、実行専用の最小限のステージを分ける)で対処するのが定石

## 実装例(コード)

```dockerfile
# マルチステージビルドの例: ビルド専用ステージと実行専用ステージを分離する
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```
