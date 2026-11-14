# 2. コードの読み方

## どこから読むか(おすすめの順)

| 順 | ファイル | 見るところ |
|---|---|---|
| 1 | `content/foundations/for-loop-flow.md` | 章の書き方(frontmatter + 本文) |
| 2 | `src/lib/content/foundations.ts` | frontmatter の型(`operationSteps`・`quiz`・`guide`・`claim`) |
| 3 | `src/lib/content/createContentLoader.ts`(76 行) | メタと詳細の分離 |
| 4 | `src/lib/step-scene.ts` | **規則表**(図の型・グリフ)。純粋関数 |
| 5 | `src/lib/guess.ts`・`ascii-crystal.ts` | 決定論的な生成 |
| 6 | `src/lib/chapter-sections.ts`・`chapter-links.ts`・`foundations-search.ts` | 本文・地図・検索 |
| 7 | `src/lib/review-store.ts` | 復習(localStorage と一体) |
| 8 | `src/app/foundations/[id]/page.tsx` | 章ページの組み立て |
| 9 | `src/components/scene/StepScene.tsx` → `FlowScene.tsx` / `Scene3D.tsx` | 手順の図 |
| 10 | `src/lib/three-scenes.ts` | 立体(長いので、必要なシーンだけ) |

## 章ページが作られる流れ

1. `foundationsLoader.getDetail(id)` が、frontmatter と本文 HTML を返す(静的生成で 1 回)。
2. `splitChapterBody` が、本文を**解説**と**例**に分け、解説の見出しに目次用の id を付ける。
3. `resolveScene(id)` で図の型を決める(`OVERRIDES` → 規則表 → 既定)。
4. `operationSteps` があれば、手順の図(`StepScene`)。各手順に `inferGlyph` でアイコンを当てる。
5. `getChapterLinks(id)` で、章のつながりの地図(ビルド時に全章の本文を走査して作る)。
6. クイズ(`ChapterQuiz`)は、間違えた問題を `recordAnswer` で復習に記録する。

## 流儀(このコードの約束)

- **対応の有無は、登録表(`id in 表`)で持つ**。frontmatter に書かない(`hasAnimation`)。
- **計算は純粋関数**にし、React・three.js に依存させない(`step-scene.ts` など)。
- **生成は決定論的**(乱数・時刻を使わない)。サーバー描画との食い違いを避ける。
- **動きは少なく**(1 画面で 2 種類まで)。`prefers-reduced-motion` と「動きを減らす」で止める。
- **色の役割を決める**(青 = 現在地・操作 / 緑 = 完了・正解 / アンバー = 注意)。
- **立体・予想・地図の「出どころ」を札で示す**(測定 / 読み取り / 模擬 / 推測)。
