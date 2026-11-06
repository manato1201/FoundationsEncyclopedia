---
name: メタデータAPIの基礎
category: Framework
subcategory: Web(Next.js等)
summary: ページのタイトルやOGP情報を、型安全なオブジェクトとして宣言的に定義できるNext.jsの仕組み。
operationSteps:
  - label: "metadataを定義する"
    note: "page.tsxやlayout.tsxで、metadataオブジェクトを書く"
  - label: "タイトルと説明を設定する"
    note: "title・descriptionを書く"
  - label: "OGPなどを設定する"
    note: "共有時に使う、画像やタイトルを設定する"
  - label: "動的なメタデータを作る"
    note: "generateMetadataで、データから値を作る"
  - label: "HTMLのheadに反映される"
    note: "ビルド結果の、headに、タグとして出力される"
---

## 概要

Next.js App RouterのメタデータAPIは、`<title>`タグやOGP(SNSでシェアされた際のプレビュー情報)のようなメタ情報を、`<head>`タグを直接書く代わりに、型付けされたオブジェクト(`Metadata`型)として定義できる仕組み。本図鑑の`layout.tsx`でも`export const metadata`としてこの仕組みを使っている。

## 基礎文法

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "基礎学習図鑑 | FoundationsEncyclopedia",
  description: "プログラミング言語・IT知識・DCC・ツール別・Frameworkの基礎知識を体系化した学習図鑑。",
};

// 動的なメタデータ(ページの内容に応じて変える場合)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entry = foundationsLoader.getDetail(id);
  return { title: entry?.name ?? "エントリが見つかりません" };
}
```

## つまずきやすい点

- 静的な`export const metadata`と、動的な`generateMetadata`関数は同時に同じファイルで使えない。ページの内容に応じてタイトルを変えたい場合は`generateMetadata`を使う必要がある
- レイアウト(`layout.tsx`)とページ(`page.tsx`)の両方でメタデータを定義すると、Next.jsが自動的にマージする。この挙動を理解していないと、意図しないメタデータの上書き・欠落に気づきにくい
- OGP画像のようなメタデータは、SNS等のクローラーがどう解釈するかに依存する部分がある。実際にシェアされた際のプレビューがどう表示されるかは、各SNSのデバッグツールで確認するのが確実

## 実装例(コード)

```tsx
export const metadata: Metadata = {
  openGraph: {
    title: "基礎学習図鑑",
    images: ["/og-image.png"],
  },
};
```
