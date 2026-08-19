---
name: Promiseの基礎
category: プログラミング言語
subcategory: JavaScript
masteryBadge: done
summary: 「いつか終わる非同期処理の結果」を表現するオブジェクト。async/awaitの土台になっている仕組み。
---

## 概要

Promiseは、非同期処理の「将来の結果」を表現するオブジェクト。`pending`(実行中)、`fulfilled`(成功)、`rejected`(失敗)という3つの状態を持ち、コールバック関数をネストさせる「コールバック地獄」を避けて非同期処理をチェーンできるようにする。`async`/`await`はPromiseをより読みやすく書くための構文糖衣。

## 基礎文法

```javascript
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    fetch(`/api/users/${id}`)
      .then((res) => res.ok ? resolve(res.json()) : reject(new Error("失敗")))
  });
}

fetchUser(1)
  .then((user) => console.log(user))
  .catch((error) => console.error(error));

// async/awaitでの同等の書き方
async function main() {
  try {
    const user = await fetchUser(1);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}
```

## つまずきやすい点

- `.then()`の中で新しいPromiseを`return`し忘れると、チェーンが正しく連結されず、後続の`.then()`が期待通りのタイミングで実行されなくなることがある
- `Promise.all()`は渡した配列のうち1つでも失敗(reject)すると、他が成功していても全体が失敗として扱われる。一部が失敗しても他の結果を使いたい場合は`Promise.allSettled()`を使う
- `async`関数は常にPromiseを返す。`await`を使わずに`async`関数を呼び出すと、戻り値はPromiseオブジェクトそのものであり、中身の値ではないという点を忘れがち

## 実装例(コード)

```javascript
// 複数の非同期処理を並行実行する
const [user, posts] = await Promise.all([
  fetchUser(1),
  fetchPosts(1),
]);
```
