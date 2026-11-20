---
name: "async/awaitの基礎(JavaScript)"
category: プログラミング言語
subcategory: "JavaScript"
summary: "Promiseを使う非同期処理を、上から下へ順に書く普通のコードのように読める形にする構文。"
claim: "await は、Promise の結果が出るまで、その関数の続きを待たせる。ほかの処理は止まらない。"
operationSteps:
  - label: "関数にasyncを付ける"
    note: "`async function load() { ... }` は、必ず Promise を返す関数になる"
  - label: "awaitで結果を待つ"
    note: "`const res = await fetch(url);` は、Promise が完了するまで、この関数の続きを止める"
  - label: "待つ間もほかの処理は動く"
    note: "止まるのは、その async 関数の続きだけ。画面の描画やほかのイベントは止まらない"
  - label: "try/catchで失敗を受ける"
    note: "待っている Promise が失敗(reject)すると、await の位置で例外として投げられる"
  - label: "並行ならPromise.all"
    note: "独立した処理は、先にまとめて開始し、`await Promise.all([...])` で一緒に待つ"
quiz:
  - question: "独立した2つの通信を、できるだけ早く終わらせたい。どう書くか"
    choices:
      - "1つ目を await してから2つ目を await する"
      - "Promise.all で2つを同時に待つ"
      - "どちらも await を付けずに書く"
    answer: 1
    explanation: "await を順に書くと、1つ目が終わるまで2つ目が始まらない。Promise.all なら、両方を開始してから待てる。"
---

## 概要

`async`/`await`は、Promise([Promiseの基礎](/foundations/javascript-promises-basics))を、`then`のつなぎではなく、普通の順序の文として書けるようにした構文。内部の仕組みはPromiseのままで、待っている間も、イベントループ([イベントループの基礎](/foundations/javascript-event-loop-basics))がほかの処理を進める。

## 基礎文法

```javascript
async function load(id) {
  const res = await fetch(`/api/items/${id}`); // 完了まで、この関数の続きを待つ
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json(); // 値を返すと、呼び出し元には Promise として渡る
}
```

- `await`は、`async`関数の中(またはESモジュールの最上位)でだけ使える
- `async`関数は、戻り値を返しても例外を投げても、呼び出し元には Promise として届く(値は解決、例外は拒否になる)
- 失敗は`try/catch`で受ける。呼び出し側でも、`await`していれば受けられる

## つまずきやすい点

- `await`を付け忘れると、値ではなく Promise が変数に入る。続きの処理で、`undefined`や`[object Promise]`が出たら、まず`await`の抜けを疑う
- ループの中で`await`を書くと、1件ずつ順に処理される。互いに関係ない処理は、`Promise.all`にまとめるほうが速い。ただし、同時に大量に送ると相手の制限に当たるので、件数には注意する
- `forEach`のコールバックに`async`を付けても、`forEach`は待ってくれない。順に待つなら`for...of`、並行なら`Promise.all(items.map(...))`を使う
- `Promise.all`は、1つでも失敗すると、全体が失敗する。個別の結果を知りたいときは、`Promise.allSettled`を使う

## 実装例(コード)

```javascript
const sleep = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function main() {
  console.time("順番");
  const a = await sleep(100, "A");
  const b = await sleep(100, "B");
  console.timeEnd("順番"); // 約200ms

  console.time("並行");
  const [c, d] = await Promise.all([sleep(100, "C"), sleep(100, "D")]);
  console.timeEnd("並行"); // 約100ms

  try {
    await Promise.reject(new Error("失敗"));
  } catch (e) {
    console.log("受け取った:", e.message);
  }
  console.log(a, b, c, d);
}
main();
```
