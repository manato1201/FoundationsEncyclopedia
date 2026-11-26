---
name: DNSの基礎(名前解決の仕組み)
category: IT知識
subcategory: ネットワーク
masteryBadge: done
summary: 人間が読めるドメイン名を、コンピュータが通信に使うIPアドレスへ変換する電話帳のような仕組み。
operationSteps:
  - label: ブラウザがOSに問い合わせる
    note: ドメイン名の名前解決をOSに依頼する
  - label: OSがキャッシュを確認する
    note: 既に解決済みならここで即座に返る
  - label: DNSリゾルバへ問い合わせる
    note: ルートサーバー→TLDサーバー→権威サーバーの順に辿る
  - label: IPアドレスを取得し通信する
    note: 得られたIPアドレスへ実際のHTTPリクエスト等を行う
visual:
  kind: sequence
  question: "example.com の IP アドレスは、だれに順に聞いて決まる?"
  legend:
    - { key: "local", label: "手元の処理", tone: "gray", mark: "・" }
    - { key: "ask", label: "問い合わせ", tone: "blue", mark: "?" }
    - { key: "refer", label: "紹介(次はこちら)", tone: "amber", mark: "→" }
    - { key: "answer", label: "答え(IP アドレス)", tone: "green", mark: "IP" }
  actors:
    - { id: "pc", label: "PC", note: "ブラウザ・OS" }
    - { id: "resolver", label: "リゾルバ", note: "ISP・パブリック DNS" }
    - { id: "root", label: "ルート", note: "ルートサーバー" }
    - { id: "tld", label: "TLD", note: ".com のサーバー" }
    - { id: "auth", label: "権威", note: "example.com のサーバー" }
  messages:
    - { id: "askOs", from: "pc", to: "pc", label: "OS に依頼", note: "ブラウザ → OS: example.com の IP は?", key: "local" }
    - { id: "cache", from: "pc", to: "pc", label: "キャッシュを確認", note: "あればここで終わり(今回はない)", key: "local" }
    - { id: "q1", from: "pc", to: "resolver", label: "example.com は?", key: "ask" }
    - { id: "q2", from: "resolver", to: "root", label: "example.com は?", key: "ask" }
    - { id: "r2", from: "root", to: "resolver", label: ".com はあちら", note: "TLD サーバーを紹介する", key: "refer" }
    - { id: "q3", from: "resolver", to: "tld", label: "example.com は?", key: "ask" }
    - { id: "r3", from: "tld", to: "resolver", label: "権威はあちら", note: "example.com の権威サーバーを紹介する", key: "refer" }
    - { id: "q4", from: "resolver", to: "auth", label: "example.com は?", key: "ask" }
    - { id: "r4", from: "auth", to: "resolver", label: "IP アドレス", note: "A レコードで答える", key: "answer" }
    - { id: "reply", from: "resolver", to: "pc", label: "IP アドレス", note: "リゾルバも答えをしばらくキャッシュする", key: "answer" }
    - { id: "connect", from: "pc", to: "pc", label: "その IP へ接続", note: "HTTP リクエストなどを送る", key: "local" }
  steps:
    - short: "OS へ"
      send: ["askOs"]
      verdict: "ブラウザは自分で調べず、OS に任せる"
    - short: "キャッシュ"
      send: ["cache"]
      verdict: "△ 前に調べた名前なら、ここで即答(TTL の間だけ)"
    - short: "リゾルバ"
      send: ["q1", "q2", "r2", "q3", "r3", "q4", "r4"]
      state: { resolver: "answer" }
      verdict: "リゾルバが ルート → TLD → 権威 の順に辿る。上の階層は、次に聞く先を教えるだけ"
    - short: "IP で通信"
      send: ["reply", "connect"]
      state: { pc: "answer" }
      verdict: "○ IP アドレスがわかり、本来の通信を始められる"
  summary: "PC はリゾルバに 1 回聞くだけ。リゾルバがルート → TLD → 権威と辿って IP アドレスを得て、答えをしばらくキャッシュする。"
---

## 概要

DNS(Domain Name System)は、`example.com`のようなドメイン名を、実際の通信に必要なIPアドレス(例: `93.184.216.34`)に変換する仕組み。この変換を「名前解決」と呼び、ブラウザでURLを開くたびに裏側で行われている。

## 基礎文法

名前解決の大まかな流れ:

1. ブラウザがOSにドメイン名の問い合わせを依頼する
2. OSはまずキャッシュを確認し、なければ設定されたDNSリゾルバ(多くはISPやパブリックDNS)に問い合わせる
3. リゾルバはルートサーバー→TLD(.com等)のサーバー→権威サーバーの順に辿り、最終的なIPアドレスを取得する
4. 得られたIPアドレスへ実際の通信(HTTPリクエスト等)を行う

## つまずきやすい点

- DNSの変更(Aレコードの更新等)は即座に世界中に反映されるわけではない。TTL(Time To Live、キャッシュの有効期限)の設定次第で、数分から数日かけて徐々に反映される
- ドメインの移管やサーバー移転の直後に「一部のユーザーには反映されているが、自分の環境ではまだ古いサーバーに繋がる」という状況は、DNSキャッシュの伝播待ちであることが多く、必ずしもエラーではない
- `A`レコード(IPv4アドレス)、`AAAA`レコード(IPv6アドレス)、`CNAME`(別名)、`MX`(メールサーバー)など、DNSレコードには複数の種類があり、それぞれ役割が異なる

## 実装例(コード)

```bash
# ターミナルからDNSの問い合わせを確認するコマンド
nslookup example.com
dig example.com A
```
