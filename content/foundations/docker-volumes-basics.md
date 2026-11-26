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
visual:
  kind: zones
  arrows: false
  question: "コンテナを消しても、データが残るのはどこ?"
  legend:
    - { key: temp, label: "書き込み層(削除で消える)", tone: amber, mark: "×" }
    - { key: mount, label: "ボリュームを接続", tone: blue, mark: "⇄" }
    - { key: kept, label: "コンテナの外に残る", tone: green, mark: "○" }
    - { key: bind, label: "手元と同じ中身", tone: violet, mark: "=" }
  zones:
    - { id: host, label: "ホストのフォルダ", note: "手元のフォルダ(バインドマウント)" }
    - { id: ctr, label: "コンテナの中", note: "書き込み層はコンテナと一緒に消える" }
    - { id: vol, label: "ボリューム data", note: "Docker が管理する、コンテナの外の領域" }
  items:
    - { id: tmp, label: "tmp.txt" }
    - { id: mnt, label: "/var/lib/app" }
    - { id: db, label: "DB のデータ" }
    - { id: code, label: "ソースコード" }
    - { id: app, label: "/app" }
  steps:
    - short: "一時的"
      place: { tmp: ctr }
      state: { tmp: temp }
      zoneFocus: [ctr]
      verdict: "× コンテナの中に書いた tmp.txt は書き込み層にあり、コンテナを消すと一緒に消える"
    - short: "volume create"
      zoneFocus: [vol]
      verdict: "docker volume create data で、コンテナの外に保存領域を用意する(まだ空)"
    - short: "-v で接続"
      place: { mnt: ctr, db: vol }
      state: { mnt: mount, db: kept }
      highlight: [mnt, db]
      verdict: "-v data:/var/lib/app で接続。アプリが /var/lib/app に書いたデータは、ボリュームに入る"
    - short: "削除しても残る"
      place: { tmp: null }
      highlight: [db, mnt]
      zoneFocus: [vol]
      verdict: "○ コンテナを消すと tmp.txt は消えるが、DB のデータは残る。新しいコンテナに同じボリュームを付ければ引き継げる"
    - short: "バインドマウント"
      place: { code: host, app: ctr }
      state: { code: bind, app: bind }
      highlight: [code, app]
      zoneFocus: [host]
      verdict: '-v "$(pwd)":/app で、手元のフォルダをそのままコンテナに見せる。直したコードがすぐ反映される'
  summary:
    columns: ["保存先", "コンテナを消すと", "主な用途"]
    rows:
      - { label: "書き込み層", cells: ["コンテナの中", "× 消える", "残さなくてよいデータ"] }
      - { label: "ボリューム", cells: ["Docker が管理する領域", "○ 残る", "DB など残したいデータ"] }
      - { label: "バインドマウント", cells: ["ホストの指定フォルダ", "○ 手元に残る", "開発中のコードの共有"] }
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
