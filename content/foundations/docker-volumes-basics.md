---
name: "Dockerのボリュームとバインドマウントの基礎"
category: IT知識
subcategory: "コンテナ・仮想化"
summary: "コンテナ内のファイルは、コンテナを削除すると消える。残したいデータは、ボリュームやバインドマウントで、コンテナの外に置く。"
claim: "コンテナの中に書いたデータは、コンテナと一緒に消える。残したいなら、外に置く。"
operationSteps:
  - label: "コンテナ内の書き込みは一時的"
    note: "コンテナ内で作ったファイルは、そのコンテナの書き込み層に保存され、コンテナを削除すると失われる"
  - label: "ボリュームを作る"
    note: "`docker volume create data` で、Dockerが管理する保存領域を作る"
  - label: "コンテナにマウントする"
    note: "`docker run -v data:/var/lib/app ...` で、ボリュームをコンテナ内のパスに接続する"
  - label: "コンテナを消してもデータは残る"
    note: "コンテナを削除しても、ボリュームは残る。新しいコンテナに、同じボリュームを付ければ、データを引き継げる"
  - label: "開発では、バインドマウントも使う"
    note: "`-v \"$(pwd)\":/app` のように、手元のフォルダを、そのままコンテナに見せる。コードの変更が、すぐ反映される"
quiz:
  - question: "データベースのデータを、コンテナの削除後も残したい。適した方法はどれか"
    choices:
      - "コンテナ内のフォルダに保存する"
      - "ボリュームをマウントして保存する"
      - "コンテナを停止だけして、削除しない"
    answer: 1
    explanation: "ボリュームは、コンテナと独立して保存される。コンテナの削除・作り直しをしても、データが残る。"
---

## 概要

Dockerのコンテナは、使い捨てるのが前提の設計になっている([Dockerの基礎](/foundations/docker-basics))。コンテナ内で書き込んだファイルは、イメージの層([イメージのレイヤー構造](/foundations/container-image-layers))の上に重なる一時的な書き込み層に置かれ、コンテナを削除すると消える。データベースのファイルのように残したいものは、**ボリューム**か**バインドマウント**で、コンテナの外に置く。

## 基礎文法

| 方式 | 保存先 | 主な用途 |
| --- | --- | --- |
| ボリューム | Dockerが管理する領域 | データベースなど、残したいデータ |
| バインドマウント | ホストの指定したフォルダ | 開発中のソースコードの共有 |
| tmpfs | メモリ上(Linuxのみ) | 残さなくてよい一時的なデータ |

```bash
docker volume create data
docker run -d --name db -v data:/var/lib/app myimage   # ボリュームを接続
docker volume ls                                        # 一覧
docker volume rm data                                   # 削除(使用中は不可)
```

- `-v 名前:パス`(名前付きボリューム)と、`-v ホストのパス:パス`(バインドマウント)は、書き方が似ている。パスで始まる(`/`や`.`)かで区別される
- Docker Composeでも、`volumes:`で同じものを定義できる([Docker Composeの基礎](/foundations/docker-compose-basics))

## つまずきやすい点

- バインドマウントは、コンテナ内のパスを、ホストのフォルダで上書きして見せる。イメージ側にあったファイルが見えなくなる
- Windowsで、バインドマウントを使うと、ファイルの読み書きが遅いことがある。保存先やファイルの種類で、差が出る
- ボリュームは、コンテナを削除しても残り続け、ディスクを使い続ける。不要なものは、`docker volume rm`や`docker volume prune`で整理する(削除は元に戻せない)
- コンテナ内のユーザーの権限と、ホストのフォルダの権限が合わず、書き込めないことがある

## 実装例(コード)

```bash
# 1つ目のコンテナでデータを書く
docker run --rm -v demo:/data alpine sh -c "echo hello > /data/memo.txt"

# コンテナは消えているが、同じボリュームを付ければ読める
docker run --rm -v demo:/data alpine cat /data/memo.txt   # hello

docker volume rm demo
```
