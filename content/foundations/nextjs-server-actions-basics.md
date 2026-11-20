---
name: "Server Actionsの基礎(Next.js)"
category: Framework
subcategory: "Web(Next.js等)"
summary: "フォームの送信などの操作を、サーバー上の関数として直接呼べる仕組み。APIのルートを別に書かなくてよい。"
claim: "Server Action は、フォームから直接呼べるサーバー上の関数。呼べるということは、誰でも呼べるので、認可の確認が必要。"
operationSteps:
  - label: "サーバー関数を書く"
    note: "async関数の先頭、またはファイルの先頭に `\"use server\"` を書く"
  - label: "formのactionに渡す"
    note: "`<form action={createPost}>` のように、関数を、フォームの action に指定する"
  - label: "送信するとサーバーで実行される"
    note: "入力は FormData として渡される。内部では POST で呼ばれる"
  - label: "サーバーで検証して保存する"
    note: "入力の検証と、ログイン・権限の確認を、関数の中で行ってから、データを書き換える"
  - label: "キャッシュを更新する"
    note: "`revalidatePath` などで、古い表示を捨てる。画面が新しい内容に更新される"
quiz:
  - question: "Server Action の中で、ログインや権限の確認が必要な理由は何か"
    choices:
      - "画面を経由せず、直接POSTして呼ぶこともできるため"
      - "FormData が暗号化されているため"
      - "Next.js が自動で拒否してくれるため"
    answer: 0
    explanation: "画面のボタンを隠しても、関数への直接のPOSTは防げない。サーバー側で毎回確認する。"
---

## 概要

従来は、フォームを送るために、APIのルートを作り、`fetch`で呼ぶという手順が必要だった。Next.jsのApp Routerでは、**Server Action**を使うと、サーバー上の関数を、`<form>`の`action`に直接渡して呼べる。データの作成・更新・削除など、「変更」を行う処理に使う。取得は[データフェッチング](/foundations/nextjs-data-fetching-basics)で行う。

## 基礎文法

```tsx
// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (title === "") return;       // 入力の検証
  // ここで、ログインと権限を確認し、データベースへ保存する
  revalidatePath("/posts");       // /posts の表示を更新する
}
```

```tsx
// app/posts/page.tsx(Server Component)
import { createPost } from "../actions";

export default function Page() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">投稿</button>
    </form>
  );
}
```

- `"use server"`をファイルの先頭に書くと、そのファイルの export する関数が、すべて Server Action になる
- Client Component の中には、Server Action を定義できない。別のファイルで定義して、importして使う
- Server Component のフォームは、JavaScript が読み込まれる前でも送信できる

## つまずきやすい点

- Server Action は、画面を経由せず、直接 POST でも呼べる。**関数の中で、毎回、認証と認可を確認する**(公式ドキュメントも、同じ注意をしている)
- 受け取る`FormData`の値は、型が保証されていない。文字列への変換や、検証を行ってから使う
- 変更しても、表示が古いままのときは、`revalidatePath`か`revalidateTag`で、キャッシュを更新していないことが多い
- 参照できる範囲は、サーバー側のコードだけ。ブラウザ専用の API(`window`など)は、使えない

## 実装例(コード)

```tsx
// app/actions.ts
"use server";

import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  if (name.length < 3) {
    throw new Error("名前は3文字以上");
  }
  // 認証の処理...
  redirect("/dashboard"); // 完了後に、別のページへ移す
}
```
