---
name: Dockerの基礎
category: IT知識
subcategory: コンテナ・仮想化
masteryBadge: review
summary: アプリケーションと実行環境を「イメージ」としてパッケージ化し、どこでも同じ挙動で動かせるようにするツール。
operationSteps:
  - label: Dockerfileからイメージをビルドする
    menuPath: "docker build -t my-app ."
  - label: イメージからコンテナを起動する
    menuPath: "docker run -p 3000:3000 my-app"
  - label: 実行中のコンテナを確認する
    menuPath: "docker ps"
  - label: コンテナを停止する
    menuPath: "docker stop <コンテナID>"
---

## 概要

Dockerは、[コンテナ](/foundations/container-vs-vm)技術を扱うためのデファクトスタンダードのツール群。アプリケーションのコード・ライブラリ・設定を「イメージ」としてまとめ、そのイメージから「コンテナ」というインスタンスを起動する、という2段階の概念で構成される。

## 基礎文法

```bash
docker build -t my-app .        # Dockerfileからイメージをビルドする
docker run -p 3000:3000 my-app  # イメージからコンテナを起動する(ホストの3000番をコンテナの3000番に接続)
docker ps                        # 実行中のコンテナ一覧を確認する
docker stop <コンテナID>          # コンテナを停止する
```

- イメージ: 「設計図」に相当する、変更されない静的な定義
- コンテナ: イメージから実際に起動された、動作中のインスタンス

## つまずきやすい点

- コンテナ内で書き込んだファイルは、そのコンテナを削除すると失われる(デフォルトでは永続化されない)。データベースのデータのように残したい情報は、「ボリューム」という仕組みでホスト側やDocker管理の永続領域に保存する必要がある
- 開発中に「イメージをビルドし直さずにコードの変更を即座に反映したい」場合は、ホストのディレクトリをコンテナ内にマウントする(バインドマウント)設定が必要になる。イメージに焼き込んだままだと、コード変更のたびに再ビルドが必要になり開発効率が落ちる
- 複数のコンテナ(Webサーバー、データベース、キャッシュ等)を組み合わせて動かす場合、`docker run`を個別に何度も実行するのは煩雑になる。[Docker Composeの基礎](/foundations/docker-compose-basics)のような複数コンテナをまとめて管理するツールを使うのが実務的

## 実装例(コード)

```bash
# ボリュームを使ってデータベースのデータを永続化する例
docker run -v postgres-data:/var/lib/postgresql/data postgres:16
```
