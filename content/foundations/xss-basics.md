---
name: XSS(クロスサイトスクリプティング)の基礎
category: IT知識
subcategory: セキュリティ
masteryBadge: review
summary: 悪意あるスクリプトを他人のブラウザ上で実行させる攻撃手法。Webアプリの最も基本的な脆弱性の1つ。
---

## 概要

XSS(Cross-Site Scripting)は、攻撃者が用意したスクリプトを、被害者のブラウザ上で実行させる攻撃。掲示板の投稿欄やプロフィール欄のように、ユーザーが入力した内容をそのままページに表示するような箇所に、エスケープ処理を怠った脆弱性があると発生する。

## 基礎文法

脆弱なコードの例:

```html
<!-- ユーザー入力をそのままHTMLとして埋め込んでしまっている -->
<div>{{ userComment }}</div>
<!-- userCommentが <script>alert('攻撃成功')</script> だった場合、実行されてしまう -->
```

対策の基本はエスケープ処理:

```javascript
// テキストとして安全に挿入する(HTMLとして解釈させない)
element.textContent = userComment; // innerHTML ではなく textContent を使う
```

## つまずきやすい点

- ReactやVueのようなモダンなフレームワークは、デフォルトで出力をエスケープしてくれる(本図鑑の`dangerouslySetInnerHTML`のような名前が付いたAPIは、その安全策を意図的にバイパスすることを警告する命名になっている)。信頼できないユーザー入力をこの種のAPIに渡すのは避けるべき
- 入力時のバリデーション(禁止文字のチェック等)だけではXSSを防げない。表示する瞬間(出力時)にエスケープすることが本質的な対策であり、「入力を制限したから安全」という思い込みは危険
- URLのクエリパラメータやリファラーのような、ユーザーが直接フォームに入力していない値も攻撃の入り口になりうる(反射型XSS)。「フォームからの入力だけ気をつければよい」という認識は不十分

## 実装例(コード)

```jsx
// 危険: userInputに悪意あるHTMLが含まれると実行されてしまう
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// 安全: 信頼できるコンテンツ(ビルド時に生成した自サイトのMarkdown等)にのみ限定して使う
<div dangerouslySetInnerHTML={{ __html: trustedMarkdownHtml }} />
```
