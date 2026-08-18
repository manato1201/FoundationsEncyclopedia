---
name: Server ComponentsとClient Componentsの違い
category: Framework
subcategory: Web(Next.js等)
masteryBadge: done
summary: どこで実行され、何ができて何ができないかが異なる2種類のReactコンポーネント。App Routerの前提知識。
---

## 概要

Next.js App Routerでは、コンポーネントはデフォルトで**Server Component**として扱われる。サーバー側(ビルド時またはリクエスト時)でのみ実行され、その結果のHTMLだけがブラウザに送られる。`"use client"`を先頭に書いたファイルは**Client Component**となり、ブラウザ側でも実行される。

## 基礎文法

```tsx
// Server Component(デフォルト)
// このファイルの実行はサーバー側で完結し、JSはブラウザに送られない
import { foundationsLoader } from "@/lib/content/foundations";

export default function HomePage() {
  const entries = foundationsLoader.getAllMeta(); // fsを使ったビルド時読み込みも可能
  return <FoundationsCatalog entries={entries} featuredId="for-loop-flow" />;
}
```

```tsx
"use client";
// Client Component
// useStateなどのフックやイベントハンドラが使える。ブラウザ側にJSとして送られる
import { useState } from "react";

export function SearchBox() {
  const [query, setQuery] = useState("");
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

## つまずきやすい点

- Server Componentの中では`useState`/`useEffect`のようなフックやイベントハンドラ(`onClick`等)が使えない。「インタラクティブなUIが必要になったら初めてClient Componentに切り替える」という考え方が基本
- `fs`を使ったファイル読み込みのようなNode.js専用APIは、Server Componentでのみ実行できる。Client Componentの中に持ち込むとビルドエラーになる
- Client Componentの中から別のコンポーネントをimportすると、そのコンポーネントも(明示的に`"use client"`を付けていなくても)Client Componentのバンドルに含まれる。「どこにuse clientの境界線を引くか」次第でブラウザへ送られるJSの量が変わる

## 実装例(コード)

```tsx
// Server ComponentからClient Componentへ、propsとしてデータを渡すのは可能
// (逆にClient ComponentからServer Componentへ直接importするのは不可)
export default function Page() {
  const data = getServerOnlyData();
  return <ClientWidget initialData={data} />;
}
```
