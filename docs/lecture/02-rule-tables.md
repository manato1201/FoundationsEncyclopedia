# 第 2 回 規則表で図の型を決める

> 所要時間の目安: 3 時間 / 前提: 第 1 回・正規表現の初歩

## この回のゴール

- 章の **id** から図の型を決める**規則表**(正規表現の並び)の読み方を説明できる。
- 「**最初に当たった規則を採る**」ことで起きる、**順序の罠**を見つけられる。
- **個別の上書き**と**既定値**の役割を説明できる。

## 1. 規則表

`step-scene.ts` の `resolveScene(id)` は、章の id に**正規表現を順に当てて**、最初に当たった規則の「立体の種類」を採ります。

```typescript
// 抜粋ファイル: src/lib/step-scene.ts
const SOLID_RULES: { kind: SolidKind; pattern: RegExp }[] = [
export function resolveScene(id: string): SceneSpec {
let solid: SolidKind = "helix";
for (const rule of SOLID_RULES) {
if (rule.pattern.test(id)) {
const spec: SceneSpec = {
return { ...spec, ...OVERRIDES[id] };
```

| 立体の種類 | 向く主題 | 例 |
|---|---|---|
| `color` | 色・光・材質 | `pbr-…`・`shader-…` |
| `tree` | 階層・木・ネットワーク | `dns-…`・`k8s-…` |
| `ring` | 輪・繰り返し・サイクル | `…cycle…`・`retry-…` |
| `stack` | 層・積み重ね | `osi-…`・`docker-…` |
| `mesh` | 形・分割 | `uv-…`・`lod-…` |
| `helix` | **どれにも当たらない**ときの既定 | – |

- **平面**(`flow`)は別の表(`CYCLE_FLOW`): 輪の語を含めば `cycle`、そうでなければ `pipeline`。
- `FLAT_FIRST`: 言語の文法チュートリアル(`python-…` など)は、流れの図が主なので、立体を既定にしない。
- `OVERRIDES`: 規則で外れる章だけを、**id で直接上書き**する。

```javascript
// 実行できる
(async () => {
  const s = await import("./src/lib/step-scene.ts");
  for (const id of ["pbr-materials", "dns-basics", "osi-model-encapsulation", "python-variables", "unknown-chapter", "cpu-gpu-npu"]) {
    const r = s.resolveScene(id);
    console.log(id.padEnd(26), "平面:", r.flow.padEnd(8), "立体:", r.solid.padEnd(6), "立体を既定:", r.solidFirst);
  }
  // 上書きは、規則より優先される
  console.log("git-branch-workflow の上書き:", JSON.stringify(s.resolveScene("git-branch-workflow")));
})();
```

```text
# 出力
pbr-materials              平面: pipeline 立体: color  立体を既定: true
dns-basics                 平面: pipeline 立体: tree   立体を既定: true
osi-model-encapsulation    平面: pipeline 立体: stack  立体を既定: true
python-variables           平面: pipeline 立体: helix  立体を既定: false
unknown-chapter            平面: pipeline 立体: helix  立体を既定: false
cpu-gpu-npu                平面: pipeline 立体: stack  立体を既定: false
git-branch-workflow の上書き: {"flow":"pipeline","solid":"tree","solidFirst":false}
```

## 2. 順序の罠

「最初に当たった規則を採る」ので、**規則の並び**と**正規表現の書き方**が結果を決めます。`tree` の規則には、`oop`(オブジェクト指向)を狙った語が入っています。ところが `oop` は、**`loop` の中にも含まれます**。

```javascript
// 実行できる
(async () => {
  const s = await import("./src/lib/step-scene.ts");
  console.log("'game-loop' に /oop/ は当たる:", /oop/.test("game-loop"));
  for (const id of ["game-loop-basics", "for-loop-flow", "javascript-event-loop-basics", "python-loops-basics", "java-oop-basics"]) {
    const r = s.resolveScene(id);
    console.log(id.padEnd(30), "平面:", r.flow.padEnd(8), "立体:", r.solid);
  }
})();
```

```text
# 出力
'game-loop' に /oop/ は当たる: true
game-loop-basics               平面: cycle    立体: tree
for-loop-flow                  平面: cycle    立体: tree
javascript-event-loop-basics   平面: cycle    立体: tree
python-loops-basics            平面: cycle    立体: tree
java-oop-basics                平面: pipeline 立体: tree
```

- ループの章は、平面では**輪(`cycle`)**になるのに、立体は**木(`tree`)**になる。**意図は輪(`ring`)**のはず(`ring` の規則に `loop` がある)が、**`tree` の規則が先に当たる**。
- 原因は 2 つ: ①`tree` の `oop` が `loop` を**部分一致**で拾う ②`tree` が `ring` より**先**にある。
- **コードは直していません**(この資料は、読んで見つけたことを記録する方針)。直すなら、`oop` を `(^|-)oop(-|$)` のように**語の境界**で縛り、**章の id 全体をテストに並べて**、変わる章を確認する(→ [学習資料 6](../learn/06-troubleshooting-maintenance.md))。

> 学び: **正規表現の表は、部分一致の事故を起こしやすい**。規則を足すたびに、**全章の結果**を前後で比べる。

## 3. 手順に当てるアイコン(グリフ)

手順の `label` に、別の規則表(`GLYPH_RULES`)を**上から順に**当てて、線画のグリフを決める。`label` で決まらなければ、`menuPath` と `note` まで含めて、もう一度探す。どれにも当たらなければ `"step"`。

```javascript
// 実行できる
(async () => {
  const s = await import("./src/lib/step-scene.ts");
  for (const label of ["コミットする", "サーバーに接続する", "ビルドを実行", "不明な手順"]) {
    console.log(label.padEnd(10), "→", s.inferGlyph({ label }));
  }
  console.log("label で決まらず、note で決まる:", s.inferGlyph({ label: "次へ", note: "データベースに保存" }));
  console.log("短くする:", s.shortLabel("ブランチを作成(feature)する長い名前の手順です", 12));
  console.log("折り返す:", JSON.stringify(s.wrapLabel("プロセスをメモリに読み込んで実行を開始する", 8, 2)));
})();
```

```text
# 出力
コミットする     → branch
サーバーに接続する  → network
ビルドを実行     → gear
不明な手順      → step
label で決まらず、note で決まる: database
短くする: ブランチを作成する長い…
折り返す: ["プロセスをメモリ","に読み込んで実…"]
```

- `shortLabel` は、**かっこ書きを落とし**、長ければ省略する。`wrapLabel` は、日本語を想定した**字数ベース**の折り返し(最大行数を超えたら省略)。

## 確認問題

1. 規則表で、規則の**順序**が結果を左右するのは、なぜですか。
2. `loop` の章が、立体で `tree` になるのは、どんな連鎖ですか。
3. 規則に当たらない章は、どうなりますか。
4. 規則表に規則を足したとき、何を確かめるべきですか。

## 解答

1. 最初に当たった規則を採るので、先にある規則が後ろの規則を隠すから。
2. `tree` の規則の `oop` が、`loop` に部分一致し、しかも `tree` が `ring` より先に評価される。
3. 既定(`helix`・立体は既定にしない)になる。
4. 全章の結果を前後で比べて、意図しない章が変わっていないこと。

## まとめ

- 図の型は、**id に当てる規則表**で決まる。**最初に当たった規則**を採り、個別の上書きが最優先、当たらなければ既定。
- 正規表現の表は、**部分一致の事故**に弱い。規則を足すたびに、全章の結果を比べる。
- 次の回は、**乱数を使わず**に作る。
