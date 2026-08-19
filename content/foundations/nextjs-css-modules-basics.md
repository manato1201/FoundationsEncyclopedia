---
name: CSS Modulesの基礎
category: Framework
subcategory: Web(Next.js等)
masteryBadge: done
summary: クラス名を自動的にユニーク化し、コンポーネントごとにスタイルの衝突を防ぐCSSの書き方。本図鑑全体で採用。
---

## 概要

CSS Modulesは、`.module.css`という拡張子でCSSファイルを作成すると、ビルドツールがクラス名を自動的にユニークな文字列に変換してくれる仕組み。本図鑑の`FoundationsCatalog.module.css`のような各コンポーネント専用のスタイルファイルは、全てこの仕組みを使っている。

## 基礎文法

```css
/* FoundationsCatalog.module.css */
.chip {
  border-radius: 999px;
}
```

```tsx
import styles from "./FoundationsCatalog.module.css";

// ビルド後、styles.chip は "FoundationsCatalog_chip__a1b2c" のような一意な文字列になる
<button className={styles.chip}>すべて</button>;
```

## つまずきやすい点

- 通常の`.css`ファイル(グローバルCSS)とCSS Modulesを混同すると、意図しないスタイルの衝突が起きることがある。`globals.css`のようなサイト全体の共通スタイルと、コンポーネント固有のスタイルの置き場所を明確に分けるのが本図鑑の設計方針
- `:global()`という記法を使うと、CSS Modules内でも特定のセレクタだけグローバルなクラス名として扱える。本図鑑の`markdownBody`のように、Markdownから生成された動的なHTML(クラス名がビルド時に決まらない)に対してスタイルを当てる際に使われている
- CSS Modulesのクラス名オブジェクト(`styles`)は、TypeScriptの型としては通常`{ [key: string]: string }`のような緩い型になっていることが多く、存在しないクラス名を`styles.typo`のように参照してもコンパイルエラーにならないことがある。実行時に「スタイルが当たっていない」ことで気づくケースがある

## 実装例(コード)

```tsx
// :global()でMarkdown生成HTMLにスタイルを当てる例(本図鑑の実際のパターン)
.markdownBody :global(h2) {
  color: var(--color-accent-blue);
}
```
