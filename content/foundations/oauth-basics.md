---
name: OAuth 2.0の基礎
category: IT知識
subcategory: セキュリティ
masteryBadge: advanced
summary: パスワードを直接渡さずに、あるサービスの機能へのアクセス権限だけを別のサービスに委譲する仕組み。
operationSteps:
  - label: ユーザーが認可を求める
    note: アプリの「Googleでログイン」のようなボタンから、Googleの認可画面へリダイレクトされる
  - label: ユーザーが権限付与を承認する
    note: どの範囲の権限(名前、メールアドレス等)をアプリに渡すかをユーザー自身が確認する
  - label: 認可コードが発行される
    note: パスワードそのものはアプリに一切渡らない
  - label: アプリがアクセストークンを取得する
    note: 認可コードを使い、Google側からアクセストークンを取得してAPIを呼び出す
visual:
  kind: sequence
  question: "パスワードを渡さずに、アプリはどう権限を受け取る?"
  legend:
    - { key: "nav", label: "画面の移動", tone: "blue", mark: "→" }
    - { key: "consent", label: "本人の同意", tone: "amber", mark: "✓" }
    - { key: "code", label: "認可コード", tone: "violet", mark: "C" }
    - { key: "token", label: "アクセストークン", tone: "green", mark: "T" }
  actors:
    - { id: "user", label: "ユーザー", note: "ブラウザ" }
    - { id: "app", label: "アプリ", note: "クライアント" }
    - { id: "authz", label: "認可サーバー", note: "例: Google のログイン" }
    - { id: "api", label: "リソースサーバー", note: "例: Google の API" }
  messages:
    - { id: "click", from: "user", to: "app", label: "ログインを押す", note: "「Google でログイン」", key: "nav" }
    - { id: "redirect", from: "app", to: "authz", label: "認可リクエスト", note: "ブラウザを認可画面へ送る(client_id・scope)", key: "nav" }
    - { id: "screen", from: "authz", to: "user", label: "同意画面", note: "渡す範囲(名前・メールなど)を示す", key: "consent" }
    - { id: "approve", from: "user", to: "authz", label: "承認", note: "パスワードは認可サーバーにだけ入力する", key: "consent" }
    - { id: "code", from: "authz", to: "app", label: "認可コード", note: "ブラウザ経由で redirect_uri へ届く", key: "code" }
    - { id: "exchange", from: "app", to: "authz", label: "コードを渡す", note: "アプリ自身の認証も添える", key: "code" }
    - { id: "token", from: "authz", to: "app", label: "アクセストークン", note: "許可された範囲だけ使える", key: "token" }
    - { id: "call", from: "app", to: "api", label: "API を呼ぶ", note: "トークンを添える", key: "token" }
    - { id: "data", from: "api", to: "app", label: "名前・メール", note: "許可された範囲のデータだけ", key: "token" }
  steps:
    - short: "認可を求める"
      send: ["click", "redirect"]
      verdict: "アプリはユーザーを認可サーバーへ送るだけ。パスワードは聞かない"
    - short: "承認"
      send: ["screen", "approve"]
      state: { user: "consent" }
      verdict: "○ どの範囲を渡すかを、ユーザー自身が決める"
    - short: "認可コード"
      send: ["code"]
      state: { app: "code" }
      verdict: "○ アプリに届くのは短命なコードだけ。パスワードは含まない"
    - short: "トークン"
      send: ["exchange", "token", "call", "data"]
      state: { app: "token" }
      verdict: "○ コードをトークンに替え、許可された範囲だけ API を使う"
  summary: "パスワードを入力するのは認可サーバーだけ。アプリは認可コードをアクセストークンに替え、許可された範囲だけ API を使う。"
---

## 概要

OAuth 2.0は、「あるWebサービス(例: Googleアカウント)へのログイン情報を、別のアプリに直接渡すことなく、限定的な権限だけを委譲する」ための認可フレームワーク。「このアプリにGoogleアカウントでログイン」のようなボタンの裏側で使われている仕組み。

## 基礎文法

代表的な認可コードフローの流れ:

1. ユーザーがアプリの「Googleでログイン」ボタンを押す
2. Googleの認可画面にリダイレクトされ、ユーザーがアプリへの権限付与を承認する
3. Googleはアプリへ「認可コード」を発行する(パスワードそのものは一切渡らない)
4. アプリはその認可コードを使い、Googleから「アクセストークン」を取得する
5. アプリはアクセストークンを使い、許可された範囲(例: 名前・メールアドレスの取得)でGoogleのAPIにアクセスする

## つまずきやすい点

- OAuth 2.0は「認可」(何ができるかの権限委譲)のためのプロトコルであり、それ単体は「認証」(相手が誰であるかの確認)を目的としていない。「ログイン」機能として使う場合は、OpenID Connect(OAuth 2.0を拡張して認証の仕組みを追加した規格)を使うのが正しいアプローチ
- アクセストークンの有効期限が切れた場合、都度ユーザーに再ログインを求めるのではなく、「リフレッシュトークン」を使って裏側で新しいアクセストークンを取得する仕組みがある。この2種類のトークンの役割の違いを理解していないと、セッション管理の実装を誤りやすい
- リダイレクトURIの検証を厳密に行わないと、認可コードを攻撃者の管理するサーバーへ横取りされる脆弱性につながる。OAuthを実装する際は、登録されたリダイレクトURIと完全一致するかの検証が必須になる

## 実装例(コード)

```
GET /oauth/authorize?client_id=xxx&redirect_uri=https://app.example.com/callback
    &response_type=code&scope=profile email
```
