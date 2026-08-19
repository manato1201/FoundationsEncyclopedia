---
name: E2Eテストの基礎
category: Framework
subcategory: テスト・CI
masteryBadge: review
summary: 実際のブラウザを操作して、ユーザーの一連の操作フローが最初から最後まで正しく動くかを検証するテスト手法。
---

## 概要

E2E(End-to-End)テストは、[単体テストのAAAパターン](/foundations/unit-test-aaa-pattern)のように関数単体を検証するのではなく、実際のブラウザを自動操作して、ユーザーが行う一連の操作(ログイン→検索→購入等)が最初から最後まで正しく動作するかを検証するテスト手法。実際のユーザー体験に最も近い形で問題を検出できる。

## 基礎文法

```typescript
// Playwrightを使ったE2Eテストの例
test("カタログから検索してエントリ詳細に遷移できる", async ({ page }) => {
  await page.goto("/");
  await page.fill('input[name="q"]', "Docker");
  await page.click("text=Dockerの基礎");
  await expect(page.locator("h1")).toContainText("Dockerの基礎");
});
```

## つまずきやすい点

- E2Eテストは実際のブラウザを起動して操作するため、単体テストと比べて実行時間が大幅に長くなる。[CIパイプラインの基本ステージ](/foundations/ci-pipeline-basics)に組み込む際は、全てのコミットで毎回実行するのではなく、重要なタイミング(マージ前等)に限定するといった運用が現実的になることが多い
- 非同期な画面更新(データの読み込み完了を待つ等)を考慮せずにテストを書くと、「たまに失敗する」不安定なテスト(flakyテスト)になりやすい。要素が実際に表示されるまで待機する仕組みを正しく使う必要がある
- E2Eテストはユーザー視点の網羅性は高いが、「なぜ失敗したか」の原因特定が単体テストより難しいことが多い。単体テスト・結合テスト・E2Eテストをバランスよく組み合わせる「テストピラミッド」という考え方がよく参照される

## 実装例(コード)

```typescript
// 非同期な要素の出現を待ってから操作する例
await page.waitForSelector("text=読み込み中", { state: "hidden" });
await page.click("button:has-text('送信')");
```
