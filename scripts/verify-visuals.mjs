// 章の frontmatter `visual:` の検証(npm run verify:visuals)。
//
// 1. 自己テスト: tests/visual-fixtures/*.md を検証し、各フィクスチャの `expectErrors`(エラー文に含まれるべき語)と
//    結果が合うかを確かめる。`expectErrors: []` は「エラー 0 件」を期待する。
// 2. 本番: content/foundations/*.md のうち `visual` を持つ章をすべて検証する(`visual` なしは対象外)。
//
// 検証の本体は src/lib/visual/schema.ts の validateVisual(画面側のフォールバック判定と同じ関数)。
// Node の型除去(--experimental-strip-types)で .ts をそのまま読む。schema.ts は型注釈以外の TS 構文を使わないこと。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { validateVisual } from "../src/lib/visual/schema.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content", "foundations");
const FIXTURES = path.join(ROOT, "tests", "visual-fixtures");

function read(file) {
  const { data } = matter(fs.readFileSync(file, "utf8"));
  return data;
}

function check(data) {
  const steps = Array.isArray(data.operationSteps) ? data.operationSteps.length : 0;
  return validateVisual(data.visual, steps);
}

let failed = 0;

// 1. 自己テスト
const fixtures = fs.readdirSync(FIXTURES).filter((name) => name.endsWith(".md")).sort();
for (const name of fixtures) {
  const data = read(path.join(FIXTURES, name));
  const expected = Array.isArray(data.expectErrors) ? data.expectErrors : null;
  if (expected === null) {
    console.error(`[fixture] ${name}: expectErrors がない`);
    failed += 1;
    continue;
  }
  const errors = check(data);
  const problems = [];
  if (expected.length === 0 && errors.length > 0) problems.push(`エラー 0 件のはずが ${errors.length} 件: ${errors.join(" / ")}`);
  if (expected.length > 0 && errors.length === 0) problems.push("エラーになるはずが 0 件");
  for (const word of expected) {
    if (!errors.some((error) => error.includes(word))) problems.push(`「${word}」を含むエラーがない(実際: ${errors.join(" / ") || "なし"})`);
  }
  if (problems.length > 0) {
    failed += 1;
    for (const problem of problems) console.error(`[fixture] ${name}: ${problem}`);
  } else {
    console.log(`[fixture] ${name}: ok (${errors.length} 件のエラーを期待どおり検出)`);
  }
}

// 2. 本番の章
const chapters = fs.readdirSync(CONTENT).filter((name) => name.endsWith(".md")).sort();
let withVisual = 0;
for (const name of chapters) {
  const data = read(path.join(CONTENT, name));
  if (data.visual === undefined) continue;
  withVisual += 1;
  const errors = check(data);
  if (errors.length > 0) {
    failed += 1;
    for (const error of errors) console.error(`[chapter] ${name}: ${error}`);
  }
}
console.log(`章 ${chapters.length} 件中、visual あり ${withVisual} 件を検証`);

if (failed > 0) {
  console.error(`verify:visuals: 失敗 ${failed} 件`);
  process.exit(1);
}
console.log("verify:visuals: ok");
