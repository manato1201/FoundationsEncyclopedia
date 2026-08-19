---
name: タグ付きユニオン(Discriminated Union)
category: プログラミング言語
subcategory: TypeScript
masteryBadge: review
summary: 共通の「タグ」プロパティでユニオン型のどの型かを判別できるようにする設計パターン。
---

## 概要

タグ付きユニオンは、複数の型を組み合わせたユニオン型の各メンバーに共通の「タグ」となるリテラル型プロパティ(`kind`や`type`等)を持たせる設計パターン。このタグを`switch`文や`if`文で分岐すると、TypeScriptがそのブランチ内で対応する具体的な型に自動的に絞り込んでくれる。

## 基礎文法

```typescript
type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: string[] };

function render(state: FetchState): string {
  switch (state.status) {
    case "loading":
      return "読み込み中...";
    case "error":
      return `エラー: ${state.message}`; // このブランチではmessageに安全にアクセスできる
    case "ready":
      return `${state.items.length}件`; // このブランチではitemsに安全にアクセスできる
  }
}
```

## つまずきやすい点

- `switch`文で全パターンを網羅していないと、コンパイラは気づかずに実行時に想定外の状態が発生することがある。`default`ケースで`never`型を使った網羅性チェック(exhaustiveness check)を仕込んでおくと、新しいパターンを追加し忘れた際にコンパイルエラーで検出できる
- タグとなるプロパティ名を、複数のユニオンメンバーで一貫させないと(例えば`status`と`type`が混在する)、絞り込みが効かなくなる
- タグ付きユニオンではなく、単に複数のプロパティを全部`optional`にしただけの型を使うと、「どの組み合わせが実際にありうるか」を型が表現できず、実行時にしか矛盾に気づけない

## 実装例(コード)

```typescript
function assertNever(value: never): never {
  throw new Error(`未対応のケース: ${JSON.stringify(value)}`);
}

function render(state: FetchState): string {
  switch (state.status) {
    case "loading":
      return "...";
    case "error":
      return state.message;
    case "ready":
      return `${state.items.length}`;
    default:
      return assertNever(state); // 網羅されていなければコンパイルエラーになる
  }
}
```
