# FoundationsEncyclopedia

プログラミング言語・IT 知識・DCC・ツール・フレームワークの**基礎**を、**ステップの図**で順番に見られる図鑑。

- 本番: https://foundations-encyclopedia.vercel.app
- **関連サイト**: 自作の 4 サイトは各画面のフッターから相互に行き来できます([アルゴリズム図鑑](https://the-algorithm-illustrated.vercel.app)・[基礎学習図鑑](https://foundations-encyclopedia.vercel.app)・[色彩図鑑](https://color-encyclopedia.vercel.app)・[Houdini リファレンス](https://houdini-reference.vercel.app))。サイトごとにオリジンが違うため、お気に入り・テーマ・設定は共有されません。
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

## ライセンス

[PolyForm Noncommercial License 1.0.0](LICENSE) です。**個人・研究・教育・非営利の利用は無料**で、自由に使えます。**営利目的の利用(会社の業務での利用、有償の製品・サービスへの組み込みなど)は許可されていません**。

- 商用利用をご希望の場合は、[Issue](https://github.com/manato1201/FoundationsEncyclopedia/issues)(ラベル `commercial`)でご相談ください。別途の許諾をお出しします。
- 著作権者: 松浦真聖 (Matsuura Manato)。表示事項は [NOTICE](NOTICE) にあります。再配布するときは、`LICENSE` と `NOTICE` を一緒に渡してください。
- 第三者の著作物(依存パッケージ・同梱の素材・外部サービスのデータなど)は、それぞれのライセンスに従います。
- この節は条文の要約です。**条文(LICENSE)が優先します**。

English: licensed under the PolyForm Noncommercial License 1.0.0. Noncommercial use is free; commercial use requires a separate license (open an issue labeled `commercial`).
