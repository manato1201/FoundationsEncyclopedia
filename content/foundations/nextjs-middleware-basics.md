---
name: Middlewareの基礎
category: Framework
subcategory: Web(Next.js等)
summary: リクエストがページに到達する前に、認証チェックやリダイレクトのような共通処理を差し込める仕組み。
operationSteps:
  - label: リクエストが届く
    note: ブラウザからのリクエストがサーバーに到達する
  - label: matcherに一致するか確認する
    note: 設定したパターンに一致するリクエストだけがMiddlewareを通る
  - label: Middlewareが実行される
    note: 認証チェックやCookieの読み書き等、共通の前処理を行う
  - label: 続行・リダイレクト・書き換えのいずれかを返す
    menuPath: "NextResponse.next() / redirect() / rewrite()"
    note: 判定結果に応じて、通常通り処理を続けるか、別の場所へ誘導する
---

## 概要

Next.jsのMiddlewareは、リクエストが実際のページやAPI Routeで処理される前に実行される、共通の前処理を書くための仕組み。認証チェック、[HTTPステータスコード](/foundations/http-status-codes-basics)を使ったリダイレクト、[Cookie](/foundations/cookie-vs-session)の読み書きなど、複数のルートに横断的に適用したい処理に向く。

## 基礎文法

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id");
  if (!sessionId && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next(); // 通常通り処理を続行する
}

export const config = {
  matcher: ["/admin/:path*"], // このパターンに一致するリクエストにのみ適用される
};
```

## つまずきやすい点

- Middlewareは[エッジコンピューティング](/foundations/cdn-and-edge-basics)の実行環境(Edge Runtime)で動くことが多く、通常のNode.js環境で使えるAPIの一部が使えない制約がある。データベースへの直接接続のような重い処理をMiddlewareに書こうとすると、実行環境の制約に阻まれることがある
- `matcher`の設定を誤ると、意図しない全てのリクエストにMiddlewareが適用され、静的アセット(画像等)へのリクエストまで巻き込んでパフォーマンスに影響することがある
- Middlewareはリクエストのたびに実行されるため、重い処理を書くとサイト全体のレスポンス速度に直結する。あくまで軽量な判定・リダイレクトに用途を限定するのが実務的

## 実装例(コード)

```typescript
// レスポンスヘッダを一括で追加する例
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Custom-Header", "value");
  return response;
}
```
