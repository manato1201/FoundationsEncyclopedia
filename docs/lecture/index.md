# FoundationsEncyclopedia 講義(基礎から・実行して確かめる)

「章のデータから、図とクイズを作る」ことを、**コードを動かして**学ぶ講義です。各回の例は `node` で実行します(`tests/test_docs.py` が、ずれと出力を検査します)。

| 回 | 題 | 学ぶこと | 目安 |
|---|---|---|---|
| [0](00-introduction.md) | 全体の見取り図 | 章(Markdown)→ ローダー → 図・クイズ・復習 | 1 h |
| [1](01-content-model.md) | 章のデータの形 | frontmatter・手順・クイズ・分類表・**自分で検査を書く** | 2.5 h |
| [2](02-rule-tables.md) | 規則表で図の型を決める | 正規表現の表・**最初に当たった規則を採る**・順序の罠 | 3 h |
| [3](03-deterministic.md) | 乱数なしで作る | 決定論的な生成・先に予想の選択肢・ASCII の結晶 | 2 h |
| [4](04-chapter-text.md) | 章の本文を扱う | 解説と例に分ける・AND 検索・本文のリンクから地図を作る | 2.5 h |
| [5](05-review-and-testing.md) | 復習の設計とテスト | 固定間隔の復習・**テストしにくい作り**と直し方 | 2 h |

例は、リポジトリのルートで `node --experimental-strip-types` が動かします(TypeScript をそのまま読み込めます。Node 22 以上)。先に `npm install` を済ませてください。講義のあとは [学習資料](../learn/index.md)。
