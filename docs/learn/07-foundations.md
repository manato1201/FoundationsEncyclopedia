# 7. 基礎の補強(言語・設計思想・アルゴリズム・用語)

講義と学習資料の**前提になっている知識**を、ここで補います。この図鑑は「**基礎知識そのもの**」を扱うので、コードを読むための基礎に加えて、**図鑑の章を読むための IT・エンタメの基本用語**も、ここにまとめます(詳しくは、各章へ)。

## 1. 言語の基礎: TypeScript・JavaScript・正規表現

### 1.1 正規表現(`RegExp`)と `test`

規則表は、**章の id に正規表現を当てて**図の型を決めます。`/pattern/.test(文字列)` は「**当たるか**」(真偽)。`|` は「または」、`(^|-)` は「**先頭、または `-` の直後**」(語の境界)、`s?` は「s が 0 または 1 個」。

```javascript
// 実行できる
const rule = /(tree|hierarchy|dns)/;
console.log("dns-basics:", rule.test("dns-basics"));
console.log("binary-tree-basics:", rule.test("binary-tree-basics"));
console.log("for-loop-flow:", rule.test("for-loop-flow"));

// 語の境界: 「oop」だけを狙う(loop には当たらない)
const oopBad = /oop/;
const oopGood = /(^|-)oop(-|$)/;
for (const id of ["java-oop-basics", "game-loop-basics"]) {
  console.log(id.padEnd(18), "部分一致:", oopBad.test(id), " 境界つき:", oopGood.test(id));
}
```

```text
# 出力
dns-basics: true
binary-tree-basics: true
for-loop-flow: false
java-oop-basics    部分一致: true  境界つき: true
game-loop-basics   部分一致: true  境界つき: false
```

- **部分一致は、意図しない所に当たる**(`loop` の中の `oop`)。**語の境界**で、狙いを絞る(→ 既知の問題 1)。

### 1.2 テンプレートリテラル・分割代入・`??`

```javascript
// 実行できる
const step = { label: "コミットする", note: undefined };
const { label, note } = step;                                  // 分割代入: 項目を取り出す
console.log(`手順: ${label}`);                                  // テンプレートリテラル: 文字列に値を埋め込む
console.log("補足:", note ?? "(なし)");                        // ??: undefined / null のときだけ、右を使う
console.log("0 は有効:", 0 ?? "既定", " 空文字は有効:", JSON.stringify("" ?? "既定"));
console.log("|| は偽の値を全部捨てる:", 0 || "既定");
```

```text
# 出力
手順: コミットする
補足: (なし)
0 は有効: 0  空文字は有効: ""
|| は偽の値を全部捨てる: 既定
```

### 1.3 クロージャと「状態を閉じ込める」

関数が、**自分の外側の変数を覚えている**(クロージャ)。**キャッシュ**や**カウンター**を、外に漏らさずに持てる。`chapter-links.ts` の `cached` も、この考え方(一度だけ作って使い回す)。

```javascript
// 実行できる
function makeOnce(build) {
  let cached = null;                    // 外からは触れない
  return () => (cached ??= build());    // 最初の 1 回だけ作り、以降は使い回す
}

let calls = 0;
const getGraph = makeOnce(() => {
  calls += 1;
  return { chapters: 495 };
});
getGraph();
getGraph();
console.log("作った回数:", calls);
```

```text
# 出力
作った回数: 1
```

### 1.4 React・Next.js の考え方(コードを読むための地図)

| 概念 | 意味 | この図鑑での例 |
|---|---|---|
| **コンポーネント** | 画面の部品。関数が見た目を返す | `StepScene`・`FlowScene` |
| **`"use client"`** | ブラウザで動く部品の印(ファイルの先頭) | `review-store.ts`・`scene-pref.ts` |
| **`useSyncExternalStore`** | 外の状態(localStorage)を、React の状態として購読する | 好みの保存 |
| **静的生成(SSG)** | ビルド時にページを作る | 495 章 |
| **App Router** | フォルダがそのまま URL | `src/app/foundations/[id]` |
| **ハイドレーション** | サーバーの HTML に、ブラウザで機能をつなぐ | 決定論的な生成が必要な理由 |
| **動的 import** | 必要なとき初めて読み込む | three.js |

## 2. 設計思想

| 原則 | 意味 | この図鑑のどこに出るか | 破るとどうなるか |
|---|---|---|---|
| **データと見せ方の規則を分ける** | 章は Markdown、図の型は規則表 | `content/` と `step-scene.ts` | 章を足すたびに、コードを直す |
| **登録表で対応を持つ** | `id in 表` | `has-animation.ts` | 記事とコードで食い違う |
| **決定論的に作る** | 乱数・時刻を使わない | `ascii-crystal.ts`・`guess.ts` | サーバーとブラウザの描画がずれる |
| **動きを少なく・止められる** | 動きの上限と、止める手段 | `prefers-reduced-motion`・「動きを減らす」 | 酔う・読めない人がいる |
| **概念図であることを明示する** | 模擬を、測定のように見せない | 出どころの札 | 利用者が、実測と誤解する |
| **前提と断定しない** | 読み取れた事実だけを出す | 章のつながりの地図 | 誤った学習順を押しつける |
| **端末の中に閉じる** | サーバーに個人の記録を送らない | localStorage | 個人情報の扱いが増える |
| **計算を外の世界から分ける** | テストしやすくする | 純粋関数(復習は、まだ分けていない) | テストできない |

## 3. 関数・アルゴリズム

| 名前 | 場所 | 何をする | 計算量・注意 |
|---|---|---|---|
| **最初に当たった規則を採る** | `resolveScene` | 規則表を上から順に当て、最初に当たったものを採る | O(規則数)。**順序が結果を決める** |
| **等間隔に選ぶ** | `guessTransitions` | n 個から、最大 3 か所を等間隔に選ぶ | O(1)(3 か所) |
| **剰余でずらす(決定論的な「ばらけ」)** | `guessChoices` | `(stepIndex + stepCount) % 個数` で並びをずらす | O(個数) |
| **AND 検索** | `matchesSearchQuery` | 全部の語を含むものだけ | O(語数 × 文字数) |
| **文字列の分割** | `splitChapterBody` | `<h2>` の手前で切って、節に分ける | O(文字数) |
| **固定間隔の復習** | `review-store.ts` | 間違えたら 1・3・7 日後 | O(1) / 回答 |
| **距離による濃淡(ASCII)** | `asciiCrystal` | 中心からの距離と角度で、文字を選ぶ | O(行 × 列) |

```javascript
// 実行できる
(async () => {
  const g = await import("./src/lib/guess.ts");
  // 等間隔に選ぶ: 遷移が多くても、問うのは最大 3 か所
  for (const steps of [3, 6, 10, 20]) console.log(`手順 ${String(steps).padStart(2)} 個 → 問う遷移:`, JSON.stringify(g.guessTransitions(steps)));

  // 剰余でずらす: 同じ入力なら、いつも同じ並び。正解の位置は、手順ごとに動く
  console.log("正解の位置(手順 0〜5):", [0, 1, 2, 3, 4].map((i) => g.guessChoices(6, i).correct).join(","));
})();
```

```text
# 出力
手順  3 個 → 問う遷移: [0,1]
手順  6 個 → 問う遷移: [0,2,4]
手順 10 個 → 問う遷移: [0,4,8]
手順 20 個 → 問う遷移: [0,9,18]
正解の位置(手順 0〜5): 0,2,1,0,2
```

## 4. IT・エンタメの基本用語(この図鑑の章への入口)

図鑑の **495 章**が、これらを詳しく説明しています。ここは**用語の入口**です(章 id は `/foundations/<id>`)。

| 分野 | 用語 | 一言で | 章 |
|---|---|---|---|
| **プログラミング** | 変数・型 / ループ / 関数 / 再帰 | 値の名前 / 繰り返し / 手順のまとまり / 自分を呼ぶ関数 | `for-loop-flow`・`recursion-basics` |
| | ポインタ・参照 / スマートポインタ | 値の場所を指す / 自動で後始末する | `cpp-pointers-basics`・`cpp-smart-pointers` |
| **データ構造・計算量** | 配列 / 連結リスト / Big-O | 連続した並び / 数珠つなぎ / 規模に対する時間の増え方 | `array-vs-linked-list`・`big-o-basics` |
| **バージョン管理** | Git / ブランチ / マージ | 変更履歴の管理 / 枝分かれ / 合流 | `git-branch-workflow` |
| **ネットワーク** | HTTP / REST API / DNS | Web の通信 / URL と動詞で操作 / 名前から住所 | `http-request-response-basics`・`rest-api-basics`・`dns-basics` |
| | OSI 参照モデル / カプセル化 | 通信を層に分けた考え方 / 層ごとに包む | `osi-model-encapsulation` |
| **インフラ** | コンテナ(Docker)/ 仮想化 / 分離 | 軽い実行環境 / 擬似的なコンピューター / 隔てる仕組み | `docker-basics`・`execution-environment-isolation` |
| **ハードウェア・AI** | CPU / GPU / NPU | 汎用 / 並列計算 / AI 専用 | `cpu-gpu-npu` |
| | 埋め込み・ベクトル検索 / 生成モデルと判断モデル | 意味を数にして検索 / 作る AI と分ける AI | `embedding-vector-search`・`generative-vs-decision-model` |
| **ゲーム** | ゲームループ / ECS / ドローコール | 毎フレームの更新と描画 / 部品の組み合わせ設計 / 描画の命令の数 | `game-loop-basics`・`ecs-basics` |
| **3D・DCC** | メッシュ / UV / PBR マテリアル | 点と面の形 / 模様を貼る座標 / 物理に基づく質感 | `blender-uv-unwrapping-basics`・`blender-pbr-material-basics` |
| **データベース** | リレーショナル DB / NoSQL | 表で持つ / 柔軟な形で持つ | `rdb-vs-nosql` |

## 確認問題

1. 規則の正規表現を `/oop/` と書くと、なぜ `loop` に当たりますか。どう直しますか。
2. `0 ?? "既定"` と `0 || "既定"` の違いは何ですか。
3. クロージャで、キャッシュを外に漏らさずに持てるのは、なぜですか。
4. 決定論的に作る理由を、ハイドレーションの言葉で説明してください。

## 解答

1. 部分一致で、`loop` の中に `oop` が含まれるから。`(^|-)oop(-|$)` のように、語の境界で縛る。
2. `??` は `undefined`・`null` のときだけ右を使う(`0` は有効)。`||` は偽の値(`0`・空文字・`false` など)を全部捨てて右を使う。
3. 関数が、外側の変数を覚えていて、その変数は、外から直接触れないから。
4. サーバーで作った HTML と、ブラウザでもう一度作った結果が食い違うと、つなぎ込み(ハイドレーション)で警告や、ちらつきが出るから。
