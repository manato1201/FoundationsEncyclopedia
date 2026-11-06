---
name: "コンテナレジストリの基礎"
category: IT知識
subcategory: "コンテナ・仮想化"
summary: "コンテナイメージを保管して、共有・配布するための置き場。pushで預け、pullで取り出す。"
claim: "レジストリは、コンテナイメージの置き場。"
operationSteps:
  - label: "イメージをビルドする"
    note: "Dockerfileから、イメージを作る"
  - label: "タグを付ける"
    note: "レジストリ名・名前・版(タグ)の形で、イメージに名前を付ける"
  - label: "レジストリへpushする"
    note: "認証してから、イメージをレジストリへ送る"
  - label: "ほかの環境でpullする"
    note: "別の機器やサーバーが、レジストリからイメージを取得する"
  - label: "取得したイメージでコンテナを起動する"
    note: "同じイメージなので、どの環境でも同じ内容で動く"
quiz:
  - question: "イメージをレジストリへ送るコマンドはどれか"
    choices:
      - "docker push"
      - "docker pull"
      - "docker ps"
    answer: 0
    explanation: "pushで預け、pullで取り出す。"
---

## 概要

**コンテナレジストリ**は、コンテナイメージを保管して、共有する置き場。ビルドしたイメージを`push`で預け、ほかの環境から`pull`で取り出す。Docker Hubのような公開のものや、組織内の非公開のものがある。

## 基礎文法

| 操作 | コマンドの例 |
| --- | --- |
| タグを付ける | `docker tag app:1.0 registry.example.com/app:1.0` |
| push | `docker push registry.example.com/app:1.0` |
| pull | `docker pull registry.example.com/app:1.0` |

## つまずきやすい点

- `latest`のタグは、中身がいつ変わるか分からない。本番では、版を固定したタグを使う
- 公開のレジストリに、秘密の情報を含むイメージを置かない。イメージの中身は、誰でも調べられる
- 取得元が信頼できるかを確認する。出所の不明なイメージは、危険な内容を含む場合がある

## 実装例(コード)

```bash
docker build -t registry.example.com/app:1.0 .
docker push registry.example.com/app:1.0
# 別の環境で
docker pull registry.example.com/app:1.0
```
