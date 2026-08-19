---
name: Next.jsでの環境変数の扱い
category: Framework
subcategory: Web(Next.js等)
summary: サーバー専用の変数と、ブラウザにも公開される変数を、NEXT_PUBLIC_プレフィックスで区別する仕組み。
---

## 概要

Next.jsは[環境変数の基礎](/foundations/environment-variables-basics)で扱った一般的な環境変数の仕組みに加え、「サーバー側でのみ参照可能な変数」と「ブラウザ側のコードにも埋め込まれる変数」を明確に区別する独自のルールを持つ。`NEXT_PUBLIC_`というプレフィックスが付いた変数だけが、ビルド時にクライアント側のバンドルにも含まれる。

## 基礎文法

```
# .env.local
DATABASE_URL=postgresql://localhost/mydb       # サーバー側のみ
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXXXXXX            # クライアント側にも公開される
```

```typescript
// Server Component内: どちらの変数にもアクセスできる
const dbUrl = process.env.DATABASE_URL;

// Client Component内: NEXT_PUBLIC_プレフィックスの変数のみアクセス可能
const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
```

## つまずきやすい点

- APIキーやデータベースの接続文字列のような秘密情報に、誤って`NEXT_PUBLIC_`を付けてしまうと、ビルド後のJavaScriptファイルに平文で埋め込まれ、ブラウザの開発者ツールから誰でも閲覧できてしまう。「公開してよい情報かどうか」を必ず意識してプレフィックスを付ける必要がある
- `NEXT_PUBLIC_`付きの環境変数は、ビルド時に値が固定的に埋め込まれる(実行時に動的に変わらない)。デプロイ後に値を変更したい場合、環境変数の値を変えるだけでなく、再ビルドが必要になることが多い
- `.env.local`は[Gitの除外設定](/foundations/gitignore-basics)に含めるのが基本だが、Vercelのようなホスティングサービスにデプロイする場合は、そのサービスの管理画面側で環境変数を別途設定する必要がある

## 実装例(コード)

```typescript
// next.config.tsでビルド時に環境変数を検証する例
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URLが設定されていません");
}
```
