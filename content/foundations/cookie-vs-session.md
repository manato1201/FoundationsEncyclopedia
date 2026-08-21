---
name: CookieとSessionの違い
category: IT知識
subcategory: Webの基礎
masteryBadge: review
summary: ステートレスなHTTPに「継続的な状態」を持たせるための代表的な2つの仕組み。保存場所と情報量が異なる。
operationSteps:
  - label: ユーザーがログインする
  - label: サーバーがセッションIDを発行する
    note: 実データはサーバー側(メモリやRedis等)に保存する
  - label: セッションIDだけがCookieとして送られる
    menuPath: "Set-Cookie: session_id=abc123"
  - label: 以降のリクエストで自動的に送信される
    note: ブラウザがCookieを付与し、サーバーがセッションIDから実データを参照する
---

## 概要

[HTTPリクエスト/レスポンスの基礎](/foundations/http-request-response-basics)で触れた通り、HTTP自体はステートレス(状態を覚えない)なプロトコル。ログイン状態のような「継続的な情報」を扱うために、Cookie(ブラウザ側に保存される小さなデータ)とSession(サーバー側に保存される、より大きく安全な情報)という仕組みが使われる。

## 基礎文法

典型的な構成:

1. ユーザーがログインすると、サーバーはセッションIDを発行し、実際のユーザー情報はサーバー側(メモリやRedis等)に保存する
2. セッションIDだけをCookieとしてブラウザに送る
3. 以降のリクエストでは、ブラウザが自動的にそのCookieを付与して送信する
4. サーバーはセッションIDをキーに、対応するユーザー情報を参照する

```
Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Lax
```

## つまずきやすい点

- Cookie自体に直接個人情報や機密情報を入れてしまうと、ブラウザの開発者ツールから容易に閲覧・改ざんされうる。Cookieには「識別子(セッションID)」だけを持たせ、実データはサーバー側で管理するのが安全な設計
- `HttpOnly`属性を付けないと、JavaScriptからCookieの値を読み取れてしまい、[XSS](/foundations/xss-basics)経由でセッションIDを盗まれるリスクが高まる。ログイン系のCookieには基本的に`HttpOnly`を付与すべき
- サーバー側にセッション情報を保存する方式は、複数台のサーバーで負荷分散する場合([ロードバランシングの基礎](/foundations/load-balancing-basics))、どのサーバーがそのセッションを持っているかという問題が生じる。外部のセッションストア(Redis等)への集約や、サーバー側に状態を持たない「JWT」のような別方式を検討する必要がある

## 実装例(コード)

```typescript
// Next.jsでのCookie設定例
response.cookies.set("session_id", sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
});
```
