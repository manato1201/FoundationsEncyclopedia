# 5. テストの書き方と実行

## 現状: 自動テストは無い

このリポジトリには、`npm run lint`(ESLint)と `npm run build`(型検査を含む)があるだけで、**コンテンツ・計算・復習の自動テストはありません**。章を足す・規則を直すときは、**自分で確かめる**必要があります(→ [拡張のレシピ](04-extend.md))。

```bash
npm run lint
npm run build
python tools/check_docs.py   # 文書の検査(node が要る)
python -m pytest -q tests/test_docs.py
```

## 確かめられること・確かめられないこと

| 対象 | 確かめ方 |
|---|---|
| 型 | `npm run build`(TypeScript) |
| コードの書き方 | `npm run lint` |
| 章のデータ(分類・クイズの答え・手順のラベル) | 講義 第 1 回の検査(自分で回す) |
| 図の型の規則 | 全章に `resolveScene` を当て、前後で比べる(学習資料 4 のレシピ C) |
| 純粋関数(`guess`・`ascii-crystal`・`chapter-sections`・`foundations-search`・`step-scene`) | Node で直接動かせる(この資料の実行例) |
| 復習(`review-store`) | **Node では動かない**(`localStorage`・`window` を直接呼ぶ) |
| 章のつながり(`chapter-links`) | **Node では動かない**(`@/` のパス別名・`fs`) |
| 画面・操作・立体の見た目 | `npm run dev` で、目で確かめる |

## よく使う型(足すときの指針)

1. **守りたいことを 1 行で言う**(例: 「`quiz` の `answer` は選択肢の範囲内」)。
2. **全章に当てる**(1 件だけでなく)。
3. **わざと壊して、落ちる**ことを確かめる。
4. **計算は純粋関数に切り出し**、外の世界(保存・時刻・画面)と分ける。時刻は**引数で渡す**(`now`)。
5. **規則表を変えたら、全章の結果を前後で比べる**。

```javascript
// 実行できる
(async () => {
  const g = await import("./src/lib/guess.ts");
  const s = await import("./src/lib/step-scene.ts");

  // 性質のテスト 1: 先に予想の選択肢は、いつも「次の手順」を含み、重複がない
  let ok = true;
  for (let count = 3; count <= 8; count++) {
    for (let step = 0; step < count - 1; step++) {
      const { indices, correct } = g.guessChoices(count, step);
      ok = ok && indices[correct] === step + 1 && new Set(indices).size === indices.length;
    }
  }
  console.log("選択肢は、次の手順を含み、重複しない:", ok);

  // 性質のテスト 2: 上書きは、規則より優先される
  console.log("上書きが効く:", s.resolveScene("git-branch-workflow").solidFirst === false);

  // 性質のテスト 3: shortLabel は、かっこ書きを落とし、長さの上限を守る
  const label = s.shortLabel("ブランチを作成(feature)する長い名前の手順です", 12);
  console.log("上限を守る:", label.length <= 12, " かっこ書きを落とす:", !label.includes("("));
})();
```

```text
# 出力
選択肢は、次の手順を含み、重複しない: true
上書きが効く: true
上限を守る: true  かっこ書きを落とす: true
```

## 文書の検査

```bash
python tools/check_docs.py             # 検査
python tools/check_docs.py --update    # 引用の更新・実行例の出力の作り直し
python tools/check_mermaid.py          # Mermaid が描画できるか(mmdc が要る)
python tools/make_diagrams.py          # 構成図(SVG)を作り直す
```

実行例は、**リポジトリのルートで `node --experimental-strip-types`**(TypeScript をそのまま読み込む)で動かし、**2 回動かして出力が一致**することを確かめる。**`@/` のパス別名や `window` を使うファイル**は、例に使えない。

## 確かめていないこと(正直に)

- **画面(React のコンポーネント)・立体(three.js)の見た目や操作**は、自動では確かめていない。
- **復習の計算**(`review-store.ts`)は、テストされていない(上のとおり、構造上、テストしにくい)。
- **章 495 件の内容の正しさ**(説明が事実と合っているか)は、この資料の範囲では確認していない。
- **アクセシビリティ**(動きを減らす・キーボード操作・読み上げ)の自動検査は無い。
