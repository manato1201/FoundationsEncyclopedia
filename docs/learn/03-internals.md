# 3. 内側のしくみ

講義(第 1〜5 回)で扱った「frontmatter の形」「規則表」「決定論的な生成」「本文の分割・検索・地図」「固定間隔の復習」は、繰り返しません。ここでは、**講義に出ない部分**を読みます。

## ローダーの共有

```typescript
// 抜粋ファイル: src/lib/content/foundations.ts
export const foundationsLoader = createContentLoader<FoundationsFrontmatter>(
"foundations",
hasAnimation,
```

`createContentLoader<T>` は、**色の図鑑(ColorEncyclopedia)と同じ形**のローダーを、3 つ目の利用先として使う(独自のローダーを書かない、という設計の方針)。第 2 引数は「**この id に可視化があるか**」を返す関数で、ここでは `hasAnimation`。

## アニメーションの登録表(`has-animation.ts`)

- 章ごとの CSS ステップアニメーションは、`src/lib/animations/*-animations.ts` の**登録表**(`Record<string, true>`)に id を書く(12 の表)。
- `hasAnimation(id)` は、**どれかの表に id があるか**(`id in 表`)を返す。**React に依存しない**ので、ビルド時(一覧)・章ページのどちらからも安全に import できる。
- **`operationSteps` で動く章は、ここに含めない**(frontmatter のフィールドの有無で、直接判定する)。
- **frontmatter に `hasAnimation` を直書きしない**(コンテンツとコードの 2 か所で、食い違うため)。

## 手順の図(`StepScene`)

| 部品 | 役割 |
|---|---|
| `StepScene.tsx` | 平面 / 立体の切り替え・好み(`fe-scene-view`)・章ごとの既定(`solidFirst`) |
| `FlowScene.tsx`(SVG) | `pipeline`(蛇行する流れ)・`cycle`(輪)。完了 = 緑の線が伸びる / 現在 = 青のパケットと光るノード / 未到達 = 薄い |
| `Scene3D.tsx` + `three-scenes.ts` | 立体 6 種(`stack`・`helix`・`ring`・`tree`・`color`・`mesh`)。ドラッグで回せる |
| `StepCaption.tsx` | いまの手順のカード(操作・コマンド・補足) |
| `ProvenanceTag.tsx` | 出どころの札(測定 / 読み取り / 模擬 / 推測) |
| `GuessCard.tsx` | 先に予想(任意) |

- three.js は、「立体」を選んだときだけ**動的に読み込む**。**WebGL が使えない環境では平面に戻る**。画面外やタブが裏のときは描画を止め、「動きを減らす」設定では、自動回転と補間を止める。
- 立体は**概念図**で、実際の寸法や数値を表さない(札で「模擬」と示す)。
- 手順の**グリフ**(約 45 種)は、`GLYPH_RULES` の規則表を、**ラベル → 補足の順**で当てて決める。

## カタログの入口

`catalog-entry-points.ts`:「まずはここから」(`STARTER_IDS` の順・**存在しない id は表示時に無視**されるので、章の改名・削除で画面は壊れない)・「用途から」(`PURPOSE_GROUPS`。既存のカテゴリ・サブカテゴリを、やりたいことで束ね直しただけ)・「すべて」。

## 復習

- 記録は `fe-review-v1`。`subscribeReviews` が `storage` イベント(別のタブ)と独自のイベントを購読する。
- 取り込み(`importReviews`)は、**全レコードを検査**し、1 つでも不正なら**何も変更しない**。同じ問題は**期限が後**の方を残す。

## 先に予想

任意(既定オフ・`fe-guess-first`)。**採点も記録もしない**。予想を問う手順では、「次へ」ボタンに**次の手順名を出さない**(答えが見えないように)。

## 更新履歴(`updates.ts`)

外部のフィードを使わず、**このサイト自身の変更を、手書きの静的データ**として持つ(新しいものを配列の先頭へ足す)。**手で足し忘れる**と、画面に出ない(自動ではない)。
