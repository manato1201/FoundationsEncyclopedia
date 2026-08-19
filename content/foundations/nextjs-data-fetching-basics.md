---
name: データフェッチングの基礎
category: Framework
subcategory: Web(Next.js等)
masteryBadge: review
summary: Server Component内でasync/awaitを使い、クライアント側のローディング状態管理なしにデータを取得できる仕組み。
---

## 概要

Next.js App Routerでは、[Server Components](/foundations/server-vs-client-components)の中で直接`async`/`await`を使ってデータを取得できる。従来のReactでよく見られた「`useEffect`でフェッチし、ローディング状態をStateで管理する」パターンが不要になり、コンポーネント自体が非同期関数として完結する。

## 基礎文法

```tsx
// Server Component内で直接データ取得を行う
export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = foundationsLoader.getDetail(id); // ビルド時にfsから直接読み込む(本図鑑の場合)
  // 外部APIの場合は fetch() をそのままawaitできる
  return <div>{entry?.name}</div>;
}
```

## つまずきやすい点

- Server Component内の`fetch`は、デフォルトで結果をキャッシュする挙動を持つ(Reactの仕組みとNext.jsの拡張が組み合わさっている)。意図せず古いデータがキャッシュされ続けることに気づきにくく、明示的に`cache: "no-store"`のようなオプションで制御する必要がある場面がある
- 複数の独立したデータ取得を直列に`await`すると、本来並行して取得できるはずのデータが逐次実行になり、ページの表示が遅くなる。[Promiseの基礎](/foundations/javascript-promises-basics)で触れた`Promise.all`のような並行化が重要になる
- Client Component([Server Components](/foundations/server-vs-client-components)参照)の中では、この直接的な`async`コンポーネントの書き方はできない。Client Component側でデータを取得したい場合は、従来通り`useEffect`やライブラリ(SWR、React Query等)を使う必要がある

## 実装例(コード)

```tsx
// 複数のデータ取得を並行化する例
export default async function Page() {
  const [entries, updates] = await Promise.all([
    fetchEntries(),
    fetchUpdates(),
  ]);
  return <div>{/* ... */}</div>;
}
```
