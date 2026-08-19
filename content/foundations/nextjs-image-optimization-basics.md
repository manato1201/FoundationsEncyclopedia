---
name: next/imageによる画像最適化の基礎
category: Framework
subcategory: Web(Next.js等)
masteryBadge: next
summary: 画像の自動リサイズ・フォーマット変換・遅延読み込みをまとめて行ってくれる、Next.js標準の画像コンポーネント。
---

## 概要

`next/image`は、通常の`<img>`タグの代わりに使う、画像表示を最適化するNext.js標準のコンポーネント。表示サイズに応じた自動リサイズ、WebPのような効率的なフォーマットへの変換、画面外の画像の遅延読み込み(Lazy Loading)などをまとめて行ってくれる。

## 基礎文法

```tsx
import Image from "next/image";

export function EntryThumbnail() {
  return (
    <Image
      src="/images/entry-thumbnail.png"
      alt="エントリのサムネイル"
      width={400}
      height={300}
      priority={false} // 画面に最初から見えている重要な画像はtrueにする
    />
  );
}
```

- `width`/`height`を指定することで、画像読み込み前でもレイアウトのズレ(Cumulative Layout Shift)を防げる

## つまずきやすい点

- `next/image`はデフォルトで遅延読み込みが有効なため、ページの最初に表示される最も重要な画像(ヒーロー画像等)にまでこの挙動を適用すると、かえって表示が遅く見えることがある。そのような画像には`priority`属性を付けて優先的に読み込ませる必要がある
- 外部ドメインの画像を扱う場合、`next.config.ts`で許可するドメインを明示的に設定しないと、最適化の対象として扱われずエラーになる。セキュリティ上の理由から、任意のドメインの画像を無条件には最適化しない設計になっている
- 画像最適化はサーバー側(または[エッジ](/foundations/cdn-and-edge-basics))での処理を伴うため、[サーバーレス](/foundations/serverless-basics)環境によっては追加のコストや制約が発生することがある。静的エクスポート(`output: "export"`)を使う場合は、画像最適化機能自体が使えない制約もある

## 実装例(コード)

```typescript
// next.config.tsで外部ドメインを許可する例
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "example.com" }],
  },
};
```
