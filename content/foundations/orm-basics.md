---
name: ORMの基礎
category: IT知識
subcategory: データベース
masteryBadge: review
summary: SQLを直接書かず、プログラミング言語のオブジェクトとしてデータベースを操作できるようにするライブラリ。
operationSteps:
  - label: モデル(クラス)を定義する
    note: テーブルの構造に対応するクラスを用意する
  - label: ORMのAPIでデータを操作する
    menuPath: "prisma.user.findFirst({ where: {...} })"
  - label: 内部でSQLが自動生成される
    note: 開発者は生のSQLを書かずに済む
  - label: 実行されたSQLを確認し効率を検証する
    note: N+1問題のような非効率なクエリが生成されていないか確認する
---

## 概要

ORM(Object-Relational Mapping)は、リレーショナルデータベースのテーブルの行を、プログラミング言語のオブジェクトとして扱えるようにするライブラリ。生のSQL文字列を書く代わりに、オブジェクト指向的なAPIでデータベース操作を記述できる。

## 基礎文法

```typescript
// Prisma(TypeScript向けORM)での例
const entry = await prisma.foundationsEntry.findFirst({
  where: { category: "IT知識" },
  orderBy: { name: "asc" },
});

await prisma.foundationsEntry.create({
  data: { name: "新しいエントリ", category: "IT知識" },
});
```

## つまずきやすい点

- ORMが生成するSQLを意識せずに書くと、意図せず非効率なクエリ(N+1問題: ループの中で毎回別々のクエリを発行してしまう等)を生成してしまうことがある。ORMを使っていても、実際に発行されるSQLをログで確認する習慣は重要
- ORMは典型的なCRUD操作(作成・読み取り・更新・削除)は簡潔に書けるが、複雑な集計クエリや、データベース固有の高度な機能を使いたい場合は、素のSQLに逃げる(または専用の記法を学ぶ)必要が出てくることがある
- ORMのモデル定義とデータベースの実際のスキーマがずれると、実行時エラーの原因になる。マイグレーション(スキーマ変更の管理)ツールと連携し、常に両者を同期させて運用する必要がある

## 実装例(コード)

```typescript
// N+1問題の例と対策
// 悪い例: エントリごとに別々のクエリでカテゴリ情報を取得してしまう
for (const entry of entries) {
  const category = await prisma.category.findUnique({ where: { id: entry.categoryId } });
}

// 良い例: 関連データを1回のクエリでまとめて取得する(eager loading)
const entriesWithCategory = await prisma.foundationsEntry.findMany({
  include: { category: true },
});
```
