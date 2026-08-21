---
name: モックの基礎
category: Framework
subcategory: テスト・CI
masteryBadge: review
summary: テスト対象が依存する外部要素を、本物の代わりに「偽物」に差し替え、テストを独立させる技法。
operationSteps:
  - label: 依存先をモックに置き換える
    menuPath: "jest.mock(\"./api\")"
    note: 外部APIやデータベースアクセスを、制御可能な偽物に差し替える
  - label: モックの戻り値を指定する
    note: テストしたい状況(成功・失敗等)に応じた戻り値を用意する
  - label: テスト対象のコードを実行する
    note: モックに差し替えた依存先を使って、テスト対象の関数を呼び出す
  - label: 呼び出され方や結果を検証する
    note: モックが期待通りの引数で呼ばれたか、戻り値が正しく使われたかを確認する
---

## 概要

モックは、テスト対象のコードが依存している外部要素(データベース、外部API、時刻等)を、本物ではなく制御可能な「偽物」に差し替える技法。[単体テストのAAAパターン](/foundations/unit-test-aaa-pattern)のArrange段階で、モックを準備することが多い。外部要因に左右されない、再現性のあるテストを書くために使われる。

## 基礎文法

```typescript
// 外部APIを呼び出す関数のモック化(Jestの例)
jest.mock("./api", () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: "Alice" }),
}));

test("ユーザー名を正しく表示する", async () => {
  const result = await getUserDisplayName(1);
  expect(result).toBe("Alice");
});
```

## つまずきやすい点

- モックを使いすぎると、「テストは通るが、実際の依存先(本物のAPI等)と繋いだ瞬間に動かない」という状況になりやすい。単体テストではモックを使いつつ、[E2Eテストの基礎](/foundations/e2e-testing-basics)のような別のレベルのテストで実際の依存先との結合を確認するバランスが重要
- モックの戻り値を本物の仕様と乖離した形で用意してしまうと、テストは通り続けるのに、本物のAPIの仕様変更に気づけないままになる。モックの内容を実際の仕様と同期させる仕組み(契約テスト等)を検討することもある
- スタブ(あらかじめ決まった値を返すだけの代役)、モック(呼び出されたかどうかの検証もできる代役)、フェイク(簡易的だが実際に動作する代役)という似た用語があり、厳密には役割が異なる。会話の中では「モック」で全てを指すことも多いが、テストフレームワークのAPIを深く使う際はこの違いを意識する必要がある

## 実装例(コード)

```typescript
// 呼び出されたかどうかを検証する例(モック特有の機能)
const mockFn = jest.fn();
doSomething(mockFn);
expect(mockFn).toHaveBeenCalledWith("expected-arg");
```
