# FoundationsEncyclopedia

プログラミング言語・IT 知識・DCC・ツール・フレームワークの**基礎**を、**ステップの図**で順番に見られる図鑑。

- 本番: https://foundations-encyclopedia.vercel.app
- 技術: Next.js 16 / React 19(静的生成)/ three.js
- コンテンツ: `content/foundations/*.md`(frontmatter の `operationSteps` で手順、`quiz` で章末クイズ)

![全体の構成図](docs/diagrams/architecture.svg)

- **手順の図**: 章の手順(`operationSteps`)を、文字の一覧ではなく**図**で見せる。平面(SVG)と立体(three.js)を切り替え。
- **章ページ**: 左に目次、中央に解説・例・クイズ。手順は再生・戻る・進む・速度で操作。
- **復習**: 章末クイズで間違えた問題を、1・3・7 日後に「復習」へ出す(ブラウザの localStorage だけ)。
- **先に予想**(任意)・**つながりの地図**・**出どころの札**(測定 / 読み取り / 模擬 / 推測)。

## クイックスタート

```bash
npm install
npm run dev      # 開発サーバー
npm run build    # ビルド(型検査を含む)
npm run lint
```

## 状態と注意

- **自動テストは、このリポジトリにはありません**(`npm run lint` と `build` のみ)。文書側の検査は `tests/test_docs.py` です。
- 立体は**概念図**で、実際の寸法や数値は表しません。実行環境の分離などの比較表は、公式ドキュメントでの確認が必要です。
- **既知の問題**(図の型の分類の不具合ほか)は、[学習資料 6](docs/learn/06-troubleshooting-maintenance.md) に記録しています。

## ドキュメント

| 読むもの | 内容 |
|---|---|
| [**講義資料**](docs/lecture/index.md) | **基礎から**(コンテンツの形・規則表で図の型を決める・決定論的な生成・章の分割と地図・復習)。全 6 回・実行できる例つき |
| [**学習資料**](docs/learn/index.md) | **保守・拡張の実務編**(コードの読み方・章や規則の足し方・テスト・トラブルと保守・用語集) |
| [画面の決めごと・機能の詳細](docs/reference/ui-and-features.md) | 旧 README(決めごと表・ステップ操作・立体・鉱石モチーフ・追加した章) |
| [設計書](FoundationsEncyclopedia_DESIGN.md) | なぜこの形か |
| [改善設計](IMPROVEMENT_DESIGN_2026-10.md)・[改善計画](IMPROVEMENT_PLAN_2026-10.md) | 2026-10 の改善 |
