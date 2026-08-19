---
name: コルーチンの基礎
category: プログラミング言語
subcategory: Kotlin
masteryBadge: review
summary: スレッドをブロックせずに非同期処理を「同期処理のように」書けるKotlinの軽量な並行処理機構。
---

## 概要

Kotlinのコルーチンは、非同期処理を`async`/`await`(C#やJavaScriptと似た発想の`suspend`関数)を使って、あたかも同期処理のように直線的に書ける仕組み。スレッドそのものよりずっと軽量で、1つのスレッド上で多数のコルーチンを切り替えながら実行できる。

## 基礎文法

```kotlin
suspend fun fetchUser(id: String): User {
    delay(1000) // スレッドをブロックせずに1秒待つ(suspend関数)
    return userApi.get(id)
}

fun main() = runBlocking {
    val user = fetchUser("123") // 同期処理のように書けるが、内部は非同期
    println(user.name)
}
```

- `suspend`修飾子が付いた関数は、他の`suspend`関数またはコルーチンビルダー(`launch`/`async`等)の中からしか呼び出せない
- `launch`: 戻り値を必要としない非同期処理を起動する
- `async`: 戻り値(`Deferred<T>`)を持つ非同期処理を起動し、`.await()`で結果を待つ

## つまずきやすい点

- `suspend`関数は「非同期に実行される」という意味ではなく、「実行を中断・再開できる関数」という意味。呼び出し方(どのDispatcherで実行するか等)次第で、実際にはメインスレッド上で順番に実行されることもある
- コルーチンスコープ(`CoroutineScope`)の管理を誤ると、画面が破棄された後もバックグラウンド処理が動き続ける「リーク」につながる。Androidの`viewModelScope`のように、ライフサイクルに紐づいたスコープを使うのが定石
- 複数の`async`を直列に`await`すると、並行に実行されず結果的に逐次実行になってしまう。本当に並行実行したい場合は、全ての`async`を起動してから、まとめて`await`する必要がある

## 実装例(コード)

```kotlin
suspend fun fetchBoth() = coroutineScope {
    val userDeferred = async { fetchUser("123") }
    val postsDeferred = async { fetchPosts("123") }
    Pair(userDeferred.await(), postsDeferred.await()) // 2つが並行に実行される
}
```
