---
name: 静的レンダリングと動的レンダリングの違い
category: Framework
subcategory: Web(Next.js等)
masteryBadge: done
summary: ビルド時にHTMLを生成しておくか、リクエストのたびに生成するか。ページごとに選べるNext.jsの中核概念。
---

## 概要

Next.jsのページは、「静的レンダリング」(ビルド時に一度だけHTMLを生成し、以降は同じ結果を使い回す)と「動的レンダリング」(リクエストが来るたびにサーバー側でHTMLを生成する)のどちらかで描画される。本図鑑のカタログ・詳細ページは全て静的レンダリング(`generateStaticParams`によるSSG)を採用している。

## 基礎文法

```tsx
// 静的レンダリング: ビルド時にどのIDの組み合わせを生成するか指定する
export function generateStaticParams() {
  return foundationsLoader.getAllIds().map((id) => ({ id }));
}

// 動的レンダリングになる典型的なパターン: リクエスト固有の情報を使う
export default async function Page() {
  const headersList = await headers(); // リクエストヘッダはビルド時には分からない
  // ...
}
```

## つまずきやすい点

- ページ内のどこか1箇所でも「リクエスト時にしか分からない情報」(Cookie、ヘッダ、検索クエリ等)を使うと、そのページ全体が動的レンダリングに切り替わる。静的にしたいページでは、そのような動的なAPIの使用を避ける必要がある
- 静的レンダリングは高速で[CDN](/foundations/cdn-basics)にキャッシュしやすい利点があるが、頻繁に更新されるデータ(在庫数、リアルタイムのスコア等)を表示するページには不向き。データの更新頻度に応じてレンダリング方式を選ぶ必要がある
- 「Incremental Static Regeneration(ISR)」という、静的生成と動的更新の中間のような仕組みもある。ビルド時に生成しつつ、一定時間経過後にバックグラウンドで再生成することで、静的な速度と、ある程度の鮮度を両立できる

## 実装例(コード)

```tsx
// ISRの設定例: 60秒ごとに再生成を許可する
export const revalidate = 60;
```
