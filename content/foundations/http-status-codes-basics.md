---
name: HTTPステータスコードの基礎
category: IT知識
subcategory: Webの基礎
masteryBadge: done
summary: レスポンスの結果を3桁の数字で表す規約。先頭の桁で大まかな分類(成功/リダイレクト/エラー等)が分かる。
operationSteps:
  - label: 2xxなら成功を確認する
    menuPath: "200 OK, 201 Created"
  - label: 3xxならリダイレクトに従う
    menuPath: "301, 304"
  - label: 4xxならクライアント側の問題を確認する
    menuPath: "400, 401, 403, 404"
  - label: 5xxならサーバー側の問題を確認する
    menuPath: "500, 503"
---

## 概要

HTTPステータスコードは、[HTTPレスポンス](/foundations/http-request-response-basics)の結果を表す3桁の数字。先頭の桁によって5つのカテゴリに分類され、コードを見ただけで「おおまかに何が起きたか」を判断できるようになっている。

## 基礎文法

| 範囲 | カテゴリ           | 代表例                                                          |
| ---- | ------------------ | --------------------------------------------------------------- |
| 1xx  | 情報               | 100 Continue                                                    |
| 2xx  | 成功               | 200 OK、201 Created、204 No Content                             |
| 3xx  | リダイレクト       | 301 Moved Permanently、304 Not Modified                         |
| 4xx  | クライアントエラー | 400 Bad Request、401 Unauthorized、403 Forbidden、404 Not Found |
| 5xx  | サーバーエラー     | 500 Internal Server Error、503 Service Unavailable              |

## つまずきやすい点

- `401 Unauthorized`(未認証)と`403 Forbidden`(認可されているが権限がない)は混同しやすい。401は「あなたが誰か分からない(ログインが必要)」、403は「あなたが誰かは分かるが、その操作をする権限がない」という意味の違いがある
- 4xx(クライアント側の問題)と5xx(サーバー側の問題)の区別を誤ると、原因の切り分けを誤ることがある。例えば入力値が不正なのに500エラーを返してしまうと、クライアント側の問題であるにもかかわらず「サーバーが壊れている」ように見えてしまう
- ステータスコードだけを見て安易にリトライ処理を組むと、4xx(クライアント側のリクエスト自体が誤っている)のようにリトライしても解決しないエラーまで無駄に再送してしまうことがある。5xxやタイムアウトのような「一時的な問題である可能性が高いエラー」に限定してリトライを行うのが定石

## 実装例(コード)

```typescript
// ステータスコードに応じた処理の分岐例
if (response.status === 401) {
  redirectToLogin();
} else if (response.status >= 500) {
  retryWithBackoff();
} else if (!response.ok) {
  showErrorMessage();
}
```
