---
name: CORS(オリジン間リソース共有)の基礎
category: IT知識
subcategory: Webの基礎
masteryBadge: next
summary: 異なるオリジン(ドメイン)間のリクエストを、ブラウザがデフォルトで制限するセキュリティ機構の緩和策。
---

## 概要

ブラウザは「同一オリジンポリシー」というセキュリティルールにより、あるオリジン(プロトコル+ドメイン+ポートの組み合わせ)で読み込まれたページから、別のオリジンへのリクエスト結果を、デフォルトでは読み取れないよう制限している。CORS(Cross-Origin Resource Sharing)は、サーバー側が「このオリジンからのアクセスは許可する」と明示することで、この制限を意図的に緩和する仕組み。

## 基礎文法

```
# サーバー側のレスポンスヘッダで許可するオリジンを指定する
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

- 単純なリクエスト以外(カスタムヘッダを使う、GET/POST以外のメソッドを使う等)では、ブラウザは本番のリクエストを送る前に「プリフライトリクエスト」(`OPTIONS`メソッド)を自動的に送信し、サーバーが許可するかどうかを事前確認する

## つまずきやすい点

- CORSはあくまで「ブラウザ側の制約」であり、サーバー間の直接通信(バックエンド同士のAPI呼び出し等)には関係しない。「CORSエラーが出た=セキュリティが破られた」わけではなく、単にブラウザがJavaScriptからのレスポンス読み取りをブロックしただけであることが多い
- 開発中に「とりあえず`Access-Control-Allow-Origin: *`(全てのオリジンを許可)にして動かす」対応をそのまま本番環境に持ち込むと、意図しないサイトからのAPI呼び出しを許してしまう脆弱性になりうる。本番では許可するオリジンを明示的に列挙するのが安全
- CookieやAuthorizationヘッダのような認証情報を含むリクエストをCORS越しに送りたい場合、`Access-Control-Allow-Credentials: true`の設定に加え、`Access-Control-Allow-Origin`を`*`ではなく具体的なオリジンにする必要がある(仕様上、認証情報付きリクエストではワイルドカードは許可されない)

## 実装例(コード)

```typescript
// Next.jsのAPI RouteでCORSヘッダを設定する例
export async function GET(request: Request) {
  return new Response(JSON.stringify({ data: "..." }), {
    headers: { "Access-Control-Allow-Origin": "https://app.example.com" },
  });
}
```
