---
name: SSHの基礎
category: IT知識
subcategory: Linux・シェル操作
masteryBadge: review
summary: 離れたサーバーへ暗号化された通信で安全にログイン・操作するためのプロトコルとツール。
operationSteps:
  - label: 鍵ペアを生成する
    note: "ssh-keygen等で公開鍵・秘密鍵のペアを作成する"
  - label: 公開鍵をサーバーへ登録する
    note: サーバー側の authorized_keys に公開鍵を追加する
  - label: 秘密鍵を使って接続する
    menuPath: "ssh -i ~/.ssh/my_key user@example.com"
  - label: サーバー側で秘密鍵の対応を検証する
    note: 検証に成功すればパスワードなしでログインできる
---

## 概要

SSH(Secure Shell)は、ネットワーク越しに別のコンピュータへ安全にログインし、コマンドを実行するためのプロトコル。通信内容は暗号化されており、パスワードやコマンドの内容が盗聴されるリスクを大幅に減らす。GitHubへのプッシュ認証やクラウドサーバーの操作など、開発の様々な場面で使われている。

## 基礎文法

```bash
ssh user@example.com          # サーバーへログイン
ssh -i ~/.ssh/my_key user@example.com  # 特定の秘密鍵を指定してログイン

scp local_file.txt user@example.com:/remote/path/  # ファイルをリモートへ転送
```

- 公開鍵認証: あらかじめサーバーに登録しておいた公開鍵と対になる秘密鍵を使ってログインする方式。パスワード認証よりも安全性が高いとされる

## つまずきやすい点

- 秘密鍵は絶対に他人と共有してはならない。誤ってバージョン管理([.gitignoreの基礎](/foundations/gitignore-basics))に含めてコミットしてしまうと、その鍵を使って誰でもサーバーへログインできてしまう深刻な事故になる
- 公開鍵と秘密鍵の役割を混同しやすい。「公開」鍵はサーバー側に登録して構わないが、「秘密」鍵は手元の端末から絶対に外に出してはいけない、という非対称性を理解する必要がある
- `~/.ssh/config`に接続先ごとの設定(ホスト名のエイリアス、使用する鍵ファイル等)をまとめておくと、複数のサーバーを扱う際に長いコマンドを毎回打たずに済む

## 実装例(コード)

```
# ~/.ssh/config の設定例
Host myserver
    HostName 203.0.113.10
    User alice
    IdentityFile ~/.ssh/my_key

# 以降は ssh myserver だけで接続できる
```
