---
name: systemdでサービスを動かす基礎
category: IT知識
subcategory: Linux・シェル操作
summary: ユニットファイルに起動の方法を書いて、systemctlで開始・停止・自動起動を管理する。
claim: "systemdは、常駐させたいプログラムを、起動・停止・再起動まで管理する。"
operationSteps:
  - label: ユニットファイルを書く
    note: "起動するコマンドや、再起動の条件を書いた .service ファイルを作る(例: /etc/systemd/system)"
  - label: 設定を読み込ませる
    note: "ファイルを置いたら、systemctl daemon-reload で systemd に読み込ませる"
  - label: サービスを開始する
    note: "systemctl start 名前 で起動する"
  - label: 自動起動を有効にする
    note: "systemctl enable 名前 で、OSの起動時に自動で始まるようにする"
  - label: 状態とログを確認する
    note: "systemctl status 名前 で状態を、journalctl -u 名前 でログを見る"
quiz:
  - question: "サービスをOSの起動時に自動で始めるようにするコマンドはどれか"
    choices:
      - "systemctl enable"
      - "systemctl status"
      - "systemctl daemon-reload"
    answer: 0
    explanation: "enableで自動起動を有効にする。startは今すぐ起動するだけで、再起動後は始まらない。"
---

## 概要

多くのLinuxでは、サービス(常駐するプログラム)の管理に**systemd**が使われる。起動のしかたを**ユニットファイル**に書いておき、`systemctl` コマンドで開始・停止・再起動・自動起動の設定を行う。

## 基礎文法

ユニットファイルの例(`/etc/systemd/system/myapp.service`):

```ini
[Unit]
Description=My App

[Service]
ExecStart=/usr/bin/node /opt/myapp/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

| コマンド | 意味 |
| --- | --- |
| `systemctl start 名前` | 今すぐ起動する |
| `systemctl enable 名前` | OSの起動時に自動で始める |
| `systemctl status 名前` | 状態を確認する |
| `journalctl -u 名前` | そのサービスのログを見る |

## つまずきやすい点

- ユニットファイルを変更したら、`systemctl daemon-reload` で読み込ませる。忘れると、古い設定のまま動く
- `start`と`enable`は別。`start`だけでは、再起動後に始まらない
- サービスに渡す環境変数や、実行するユーザーは、ユニットファイルで指定する。手動で動かしたときと環境が違うので、動き方が変わることがある

## 実装例(コード)

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp   # 自動起動を有効にして、今すぐ起動する
systemctl status myapp
```
