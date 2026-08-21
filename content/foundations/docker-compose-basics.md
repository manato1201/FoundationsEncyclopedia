---
name: Docker Composeの基礎
category: IT知識
subcategory: コンテナ・仮想化
masteryBadge: next
summary: 複数のコンテナ(Webサーバー、DB等)をまとめて定義・起動できるようにするツール。開発環境の構築で特に重宝する。
operationSteps:
  - label: docker-compose.ymlにサービスを定義する
    note: Webサーバー・データベース等、必要なコンテナをまとめて記述する
  - label: docker compose upを実行する
  - label: 各サービスが起動しネットワークで接続される
    note: サービス名がそのままコンテナ間のホスト名として使える
  - label: docker compose downで一括停止・削除する
---

## 概要

Docker Composeは、複数のコンテナで構成されるアプリケーション(Webサーバー+データベース+キャッシュサーバー等)を、1つのYAMLファイルにまとめて定義し、`docker compose up`のコマンド1つで全てを起動できるようにするツール。個々に`docker run`を実行する手間を省き、コンテナ間のネットワーク接続も自動的に設定してくれる。

## 基礎文法

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

```bash
docker compose up      # 定義した全サービスを起動
docker compose down    # 全サービスを停止・削除
```

## つまずきやすい点

- `depends_on`は「起動する順序」を制御するだけで、依存先のサービス(データベース等)が実際に接続可能な状態になるまで待つわけではない。Webサーバー側で接続失敗時のリトライ処理を実装しておかないと、起動直後の一瞬だけ接続エラーが発生することがある
- サービス名(上記の`web`や`db`)は、コンテナ間の通信で使えるホスト名としてそのまま機能する。Webサーバーからデータベースへ接続する際、`localhost`ではなくサービス名(`db`)を指定する必要がある点に初学者は戸惑いやすい
- Docker Composeは開発環境や小規模な構成には向くが、本番環境で複数台のサーバーにまたがる大規模な運用には、[コンテナオーケストレーション](/foundations/container-orchestration-basics)(Kubernetes等)の方が適していることが多い

## 実装例(コード)

```yaml
# サービス間の接続例: webサービスからdbへホスト名"db"で接続する
DATABASE_URL: "postgresql://user:secret@db:5432/app"
```
