---
name: REST APIの基礎
category: IT知識
subcategory: Webの基礎
masteryBadge: done
summary: リソースをURLで表現し、HTTPメソッドで操作するというWeb API設計の代表的なスタイル。
operationSteps:
  - label: リソースをURLで表現する
    menuPath: "/api/entries/123"
  - label: 適切なHTTPメソッドを選ぶ
    note: GET/POST/PUT/DELETEのいずれかで操作を表す
  - label: リクエストを送信する
  - label: レスポンスのステータスコードとボディを確認する
---

## 概要

REST(Representational State Transfer)は、Web APIを設計する際の代表的なスタイル・原則の集合。「リソース」(データの塊)をURLで表現し、[HTTPメソッド](/foundations/http-methods-basics)を使ってそのリソースへの操作(取得・作成・更新・削除)を表現する、という考え方が中心にある。

## 基礎文法

```
GET    /api/entries          # エントリ一覧を取得
GET    /api/entries/123      # 特定のエントリを取得
POST   /api/entries          # 新しいエントリを作成
PUT    /api/entries/123      # 特定のエントリを更新
DELETE /api/entries/123      # 特定のエントリを削除
```

- URLは「名詞(リソース)」を表し、「動詞(操作)」はHTTPメソッドで表現するのがRESTらしい設計とされる(`/api/getEntries`のような動詞を含むURLは避ける)

## つまずきやすい点

- 「REST API」と名乗っていても、実際にはRESTの原則を厳密に満たしていないAPI(RESTライクなAPI)が非常に多い。全ての原則(HATEOASと呼ばれる、レスポンスに次の操作へのリンクを含める等)を厳密に守っている実装はむしろ少数派で、「リソース指向でHTTPメソッドを使い分ける」程度の緩やかな解釈で運用されることが多い
- ネストしたリソース(あるユーザーの投稿一覧等)のURL設計(`/users/1/posts`か`/posts?userId=1`か)には複数の流儀があり、プロジェクト内で一貫性を保つことが重要。統一されていないと、APIの利用者が予測しにくくなる
- REST APIは1回のリクエストで1つのリソース(またはリソース一覧)を返すのが基本のため、画面が必要とする複数の異なるリソースを組み合わせたい場合、複数回のリクエストが必要になることがある。この課題への別解としてGraphQLのような技術も存在する

## 実装例(コード)

```typescript
// Next.jsのApp RouterでのREST APIエンドポイントの例
// src/app/api/entries/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const entry = await getEntry(params.id);
  return Response.json(entry);
}
```
