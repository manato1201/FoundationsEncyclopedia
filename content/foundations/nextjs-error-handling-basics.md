---
name: エラーハンドリング(error.tsx)の基礎
category: Framework
subcategory: Web(Next.js等)
masteryBadge: review
summary: ルートごとにエラー時の表示を差し込める、Next.js App Router特有の規約ファイル。
operationSteps:
  - label: レンダリング中に例外が発生する
    note: ページやコンポーネントの描画処理中にエラーが投げられる
  - label: 最も近いerror.tsxが捕捉する
    note: そのルート配下に配置されたerror.tsxがError Boundaryとして機能する
  - label: フォールバックUIが表示される
    note: 通常の画面の代わりに、エラー内容とresetボタンを含む画面が表示される
  - label: resetで再試行できる
    menuPath: "reset()"
    note: 呼び出すと、エラーが起きたセグメントの再レンダリングを試みる
---

## 概要

Next.js App Routerでは、`error.tsx`という特別な名前のファイルを配置することで、そのルート配下でエラーが発生した際の表示(フォールバックUI)を定義できる。Reactの「Error Boundary」という仕組みを、ファイルベースの規約として簡単に使えるようにしたもの。

## 基礎文法

```tsx
// src/app/foundations/[id]/error.tsx
"use client"; // error.tsxは必ずClient Componentである必要がある

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <p>エラーが発生しました: {error.message}</p>
      <button onClick={() => reset()}>再試行</button>
    </div>
  );
}
```

- `not-found.tsx`: 存在しないページ([HTTPステータスコード](/foundations/http-status-codes-basics)の404に相当)を表示するための、似た仕組みの別ファイル

## つまずきやすい点

- `error.tsx`はレンダリング中に発生したエラーだけを捕捉する。イベントハンドラの中で発生したエラーや、`async`関数内で明示的に`try/catch`していない非同期エラーの一部は捕捉されないことがあり、「エラー画面が出るはずなのに真っ白のまま」という状況の原因になりうる
- `error.tsx`は必ず`"use client"`が必要という制約があり、[Server Components](/foundations/server-vs-client-components)のメリット(サーバー側だけで完結する処理)を活かしたエラーハンドリングをそのまま書くことはできない
- 開発環境ではNext.jsが詳細なエラースタックを表示してくれるが、本番環境ではセキュリティ上の理由から詳細情報が隠される。本番でも問題を追跡できるよう、エラー監視サービス(Sentry等)との連携を検討する必要がある

## 実装例(コード)

```tsx
// ルートレベルの最上位エラーハンドラ(global-error.tsx)
// レイアウト自体のエラーも捕捉したい場合に使う特別なファイル
"use client";
export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body>致命的なエラーが発生しました</body>
    </html>
  );
}
```
