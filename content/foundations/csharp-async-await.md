---
name: async/awaitによる非同期処理の基礎
category: プログラミング言語
subcategory: C#
masteryBadge: review
summary: 時間のかかる処理を「待っている間も他の処理を進められる」形で書くための構文。UI/ゲームループの応答性維持に直結する。
---

## 概要

`async`/`await`は、時間のかかる処理(ファイルI/O、ネットワーク通信など)を、呼び出し元のスレッドをブロックせずに書くための構文。`await`した箇所でメソッドの実行はいったん呼び出し元に制御を返し、非同期処理が完了した時点で残りの処理が再開される。

## 基礎文法

```csharp
async Task<string> FetchDataAsync()
{
    using var client = new HttpClient();
    string result = await client.GetStringAsync("https://example.com");
    return result;
}

async void OnButtonClick()
{
    string data = await FetchDataAsync();
    Debug.Log(data); // FetchDataAsyncの完了後にここが実行される
}
```

- `async`: そのメソッドが非同期メソッドであることを示す修飾子
- `await`: `Task`/`Task<T>`の完了を待ち、その間は呼び出し元スレッドをブロックしない
- `Task`: 戻り値のない非同期処理、`Task<T>`: 型`T`の結果を返す非同期処理

## つまずきやすい点

- `async void`はイベントハンドラ以外では避けるべきとされる。例外が呼び出し元でキャッチできず、非同期処理の完了を待つこともできないため
- `await`を書き忘れて`Task`をそのまま無視すると(fire-and-forget)、例外が握りつぶされたり、処理順序が意図と異なったりする
- UIスレッド(Unityのメインスレッド等)で重い同期処理を`await`なしに実行すると、非同期化した意味がなくフレームが止まる。非同期化は「重い処理をどこで実行するか」も合わせて設計する必要がある

## 実装例(コード)

```csharp
async Task LoadAllAsync(IEnumerable<string> urls)
{
    var tasks = urls.Select(url => FetchDataAsync());
    string[] results = await Task.WhenAll(tasks); // 複数の非同期処理を並行して待つ
}
```
