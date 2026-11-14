# 第 4 回 章の本文を扱う

> 所要時間の目安: 2.5 時間 / 前提: 第 3 回・正規表現

## この回のゴール

- 本文の HTML を、**解説と例に分け**、見出しに目次用の id を付ける方法を説明できる。
- **AND 検索**の判定を説明できる。
- 本文のリンクから**章のつながりの地図**を作る考え方を説明できる(**「前提」と断定しない**理由も)。

## 1. 解説と例に分ける(`chapter-sections.ts`)

ローダーが `marked` で作った本文の HTML を、`<h2>` の**手前で**切り、各節を見る。見出しが **「実装例」で始まる節**は「例」タブへ、ほかは「解説」へ。解説側の `<h2>` には、**目次(スクロールスパイ)用の id**(`section-1`・`section-2` …)を付ける。

```javascript
// 実行できる
(async () => {
  const { splitChapterBody } = await import("./src/lib/chapter-sections.ts");

  const html = "<p>導入</p><h2>仕組み</h2><p>a</p><h2>実装例: シェル</h2><p>b</p><h2>注意</h2><p>c</p>";
  const r = splitChapterBody(html);
  console.log("解説:", r.explanationHtml);
  console.log("例:", r.exampleHtml);
  console.log("目次:", JSON.stringify(r.headings));

  const none = splitChapterBody("<h2>概要</h2><p>x</p>");
  console.log("実装例の節が無い章:", none.exampleHtml);
})();
```

```text
# 出力
解説: <p>導入</p><h2 id="section-1">仕組み</h2><p>a</p><h2 id="section-2">注意</h2><p>c</p>
例: <h2>実装例: シェル</h2><p>b</p>
目次: [{"id":"section-1","text":"仕組み"},{"id":"section-2","text":"注意"}]
実装例の節が無い章: null
```

- 「実装例」の節の見出しには **id を付けない**(目次に出さない)。
- 本文は**リポジトリの中の信頼できる Markdown** を HTML にしたもので、ここでは**切り分けと id の付与だけ**を行う(サニタイズはしない)。

## 2. AND 検索(`foundations-search.ts`)

カタログの自由テキスト検索。**空白で区切った複数の語を、すべて含む**ものだけを残す(AND)。対象は、名前・カテゴリ・サブカテゴリ・要約を**つなげた文字列**。大文字小文字は区別しない。

```javascript
// 実行できる
(async () => {
  const { matchesSearchQuery: match } = await import("./src/lib/foundations-search.ts");
  const entry = { name: "Git の基本", category: "ツール", subcategory: "バージョン管理", summary: "履歴を管理する" };

  console.log("git 履歴        →", match(entry, "git 履歴"));
  console.log("git docker      →", match(entry, "git docker"));
  console.log("GIT(大文字)    →", match(entry, "GIT"));
  console.log("空白だけ        →", match(entry, "   "));
  console.log("バージョン 管理 →", match(entry, "バージョン 管理"));
})();
```

```text
# 出力
git 履歴        → true
git docker      → false
GIT(大文字)    → true
空白だけ        → true
バージョン 管理 → true
```

- 空の検索は、**全部を通す**。**1 語でも含まれなければ、落とす**(AND)。

## 3. 本文のリンクから、地図を作る(`chapter-links.ts`)

本文の中の `/foundations/<id>` へのリンクを、正規表現で拾い、**「この章が参照している章」**と**「この章を参照している章」**の 2 方向の表を、ビルド時に作る。

```typescript
// 抜粋ファイル: src/lib/chapter-links.ts
const LINK_PATTERN = /\]\(\/foundations\/([a-z0-9-]+)\)/g;
if (target === meta.id || !names.has(target)) continue;
```

- **自分自身**へのリンクと、**存在しない章**へのリンクは、数えない。
- **「前提」とは断定しない**。「本文がこの章を参照している」という**読み取った事実**だけを出す(出どころの札は「読み取り」)。リンクがあることと、**学ぶ順序の前提**であることは、別のこと。
- この関数は `@/` のパス別名と `fs` を使うので、**Node から直接は試せない**(→ 第 5 回)。

## 確認問題

1. 「実装例」の節が「例」タブへ分けられるのは、見出しのどんな条件ですか。
2. `git docker` で検索したとき、`Git の基本` が出ないのは、なぜですか。
3. 章のつながりの地図を「前提」と呼ばないのは、なぜですか。

## 解答

1. `<h2>` の中身が「実装例」で始まること。
2. AND 検索で、`docker` を含まないから。
3. リンクは「参照している」事実しか表さず、学ぶ順序の前提とは限らないから。

## まとめ

- 本文は `<h2>` で切り、「実装例」は別に。解説の見出しに目次の id を付ける。
- 検索は AND(空は全部通す)。つながりの地図は、**読み取った事実**だけ。
- 次の回は、**復習**と、テストのしにくさ。
