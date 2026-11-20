---
name: "マップ(map)の基礎"
category: プログラミング言語
subcategory: "Go"
summary: "キーで値を引くGoの組み込みデータ構造。存在しないキーはゼロ値を返すので、有無を確かめるには「カンマok」の形を使う。"
claim: "map は、存在しないキーを読むとゼロ値が返る。有無を知りたいときは、`v, ok := m[k]` を使う。"
operationSteps:
  - label: "mapを作る"
    note: "`m := map[string]int{\"apple\": 3}` か、`make(map[string]int)` で作る"
  - label: "キーで値を読み書きする"
    note: "`m[\"pear\"] = 5` で追加・更新、`m[\"pear\"]` で読む"
  - label: "存在しないキーはゼロ値"
    note: "`m[\"kiwi\"]` は、エラーにならず、値の型のゼロ値(int なら 0)を返す"
  - label: "カンマokで有無を確かめる"
    note: "`n, ok := m[\"kiwi\"]` の ok が、キーが存在したかを表す"
  - label: "deleteで削除する"
    note: "`delete(m, \"apple\")` で、キーと値を取り除く。存在しないキーを指定しても、問題ない"
quiz:
  - question: "存在しないキーを map から読むと、どうなるか"
    choices:
      - "実行時エラーになる"
      - "値の型のゼロ値が返る"
      - "nil が返る"
    answer: 1
    explanation: "map は、エラーではなくゼロ値を返す。値が本当に0なのか、存在しないのかは、カンマokで区別する。"
---

## 概要

Goの`map`は、キーと値の組を保持する組み込みの型で、他の言語の辞書やハッシュマップに当たる。`map[キーの型]値の型`と書く。キーには、`==`で比べられる型(文字列・整数・構造体など。スライスは不可)を使う。

## 基礎文法

```go
stock := map[string]int{"apple": 3}  // 作成と初期化
stock["pear"] = 5                    // 追加・更新

n := stock["kiwi"]                   // 存在しないので、0(ゼロ値)
n, ok := stock["kiwi"]               // ok は false
delete(stock, "apple")               // 削除
fmt.Println(len(stock))              // 要素数
```

- `make(map[string]int)`で空のmapを作る。`var m map[string]int`だけだと、nilのmapになる
- `for k, v := range m`で全件を回す。**順序は、実行ごとに変わってよい**ように設計されている

## つまずきやすい点

- nilのmapへの**書き込み**は、実行時パニックになる(読み取りは、ゼロ値が返るだけ)。使う前に`make`か、リテラルで初期化する
- `range`の順序は保証されない。順番が必要なら、キーを取り出して、`sort`で並べてから使う
- 複数のgoroutineから、同時にmapを書き込むと、競合になる。排他制御(`sync.Mutex`)や`sync.Map`が必要([Goroutineの基礎](/foundations/go-goroutines-basics))
- 値が構造体のとき、`m[k].field = x`のように、直接フィールドを書き換えられない。取り出して変更し、書き戻す(または、ポインタを値にする)

## 実装例(コード)

```go
package main

import "fmt"

func main() {
	stock := map[string]int{"apple": 3}
	stock["pear"] = 5

	if n, ok := stock["kiwi"]; !ok {
		fmt.Println("kiwiはない", n) // kiwiはない 0
	}

	delete(stock, "apple")
	fmt.Println(len(stock), stock["pear"]) // 1 5
}
```
