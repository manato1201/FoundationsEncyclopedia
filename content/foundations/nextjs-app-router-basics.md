---
name: App Routerのファイルベースルーティング
category: Framework
subcategory: Web(Next.js等)
masteryBadge: review
summary: ディレクトリ構造がそのままURLパスに対応する、Next.js App Routerの基本規約。
---

## 概要

Next.js App Router(`src/app`配下)は、ディレクトリ構造がそのままURLのパス構造に対応するファイルベースルーティングを採用している。`app/foundations/[id]/page.tsx`のような動的セグメント(`[id]`)を使うと、1つのファイルで無数のURLパターンに対応できる。

## 基礎文法

```
src/app/
├── page.tsx              → "/"
├── foundations/
│   └── [id]/
│       └── page.tsx      → "/foundations/csharp-linq-basics" など
```

- `page.tsx`: そのルートで実際に表示されるUIを定義する
- `layout.tsx`: 配下のページ全体に共通するレイアウト(ヘッダー等)を定義する
- `[id]`のような角括弧ディレクトリは動的セグメントを表す
- `generateStaticParams()`を定義すると、ビルド時にどの`[id]`の組み合わせを静的生成するかを指定できる

## つまずきやすい点

- App Router配下のコンポーネントはデフォルトでServer Componentとして扱われる。`useState`等のクライアント専用機能を使うには`"use client"`を明示する必要がある
- `generateStaticParams()`を書かずに動的セグメントを使うと、静的サイト生成(SSG)ではなくオンデマンドでのレンダリングになり、`output: "export"`のような完全静的出力ができなくなる
- `fs`を使ったファイル読み込み(Markdownのビルド時ロード等)はServer Componentやビルド時処理でのみ実行可能で、クライアントコンポーネントには持ち込めない

## 実装例(コード)

```tsx
// src/app/foundations/[id]/page.tsx
export function generateStaticParams() {
  return foundationsLoader.getAllIds().map((id) => ({ id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = foundationsLoader.getDetail(id);
  // ...
}
```
