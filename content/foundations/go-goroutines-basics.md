---
name: Goroutineの基礎
category: プログラミング言語
subcategory: Go
masteryBadge: next
summary: goキーワード1つで起動できる軽量な並行処理単位。OSスレッドより遥かに軽く、大量に生成できる。
---

## 概要

Goroutineは、Go言語における並行処理の基本単位。`go`キーワードを関数呼び出しの前に付けるだけで、その関数を新しいGoroutineとして非同期に実行できる。OSスレッドと比べて生成コストが非常に低く(初期スタックサイズが数KB程度)、数万〜数十万のGoroutineを同時に扱うプログラムも珍しくない。

## 基礎文法

```go
func fetchData(url string, ch chan<- string) {
    resp, _ := http.Get(url)
    body, _ := io.ReadAll(resp.Body)
    ch <- string(body) // チャネル経由で結果を返す
}

func main() {
    ch := make(chan string)
    go fetchData("https://example.com", ch) // 新しいGoroutineで実行
    result := <-ch // 結果を待つ
    fmt.Println(result)
}
```

## つまずきやすい点

- `go`で起動したGoroutineは、`main`関数が終了すると実行途中でも強制終了される。バックグラウンド処理の完了を待ちたい場合は`sync.WaitGroup`やチャネルで明示的に同期する必要がある
- ループの中でGoroutineを起動する際、ループ変数をクロージャで直接キャプチャすると(Go 1.22より前のバージョンでは)全てのGoroutineが同じ変数を共有してしまい、意図しない値になることがある。ループ変数を関数の引数として明示的に渡すのが安全な書き方
- Goroutineを大量に起動しても、それだけで自動的に安全に並行処理ができるわけではない。共有データへの同時アクセスは[チャネル](/foundations/go-channels-basics)や`sync.Mutex`で保護する必要がある

## 実装例(コード)

```go
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(n int) { // 引数として明示的に渡す
        defer wg.Done()
        fmt.Println(n)
    }(i)
}
wg.Wait() // 全てのGoroutineの完了を待つ
```
