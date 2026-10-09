# FoundationsEncyclopedia

基礎的な内容をまとめたリポジトリです。プログラミング言語・IT知識・DCC・ツール・フレームワークの基礎を、CSSのステップアニメーションで順番に見られる図鑑です。

- 本番: https://foundations-encyclopedia.vercel.app
- 技術: Next.js 16 / React 19(静的生成)
- コンテンツ: `content/foundations/*.md`(frontmatterの `operationSteps` でステップ表示、`quiz` で章末クイズ)

## 開発

```bash
npm install
npm run dev
```

## 画面デザインの決めごと表

迷いやすい点は、ここで先に決めておく(`IMPROVEMENT_DESIGN_2026-10.md` 参照)。

| 項目 | 決めごと |
| --- | --- |
| 光(glow) | 「いま見ているステップ」の要素だけ。静的な装飾には付けない。ライトテーマでは光の代わりに小さな影 |
| 色の役割 | 青 = 現在地・操作 / 緑 = 完了・正解 / アンバー = 注意・補足 |
| 数字 | 等幅数字(`data-tabular`)。進捗は `3 / 9` の形式 |
| アイコン | `src/components/icons/Icon.tsx` の線画セットだけを使う(文字の矢印は使わない) |
| 見出し | 見出し + 灰色の副題の2段 |
| テーマ | 同じトークン名でダーク/ライトを切替(`data-theme`)。初期値はOS設定 |
| 動き | `prefers-reduced-motion` では動きを止める |

## 章ページの構成

左 = 同じ分類の目次 / 中央 = 見出し・ステップアニメ・解説 / アニメ枠の下 = ステップ操作(再生・戻る・進む・速度)。章末にクイズがある章では、間違えた問題を 1・3・7 日後にトップの「復習」へ出す(ブラウザのlocalStorage、固定間隔。将来FSRS等へ置き換え可)。

## 追加した章(AI基礎ほか)

- CPU・GPUとNPUの違い(`cpu-gpu-npu`、3レーンの専用アニメ。電力は定性的な目安)
- 生成モデルと判断モデルの違い(`generative-vs-decision-model`)
- 実行環境の分離(`execution-environment-isolation`、比較表は公式ドキュメントでの確認が必要)
- 埋め込みとベクトル検索(`embedding-vector-search`、768→128次元で容量は約1/6)
