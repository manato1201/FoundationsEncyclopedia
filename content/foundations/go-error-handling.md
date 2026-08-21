---
name: Goのエラーハンドリング
category: プログラミング言語
subcategory: Go
summary: 例外機構を持たず、戻り値としてエラーを明示的に返し合うGo言語独自のエラー処理スタイル。
operationSteps:
  - label: 関数が(結果, error)を返す
    note: "エラーが起きうる処理は慣習的に2値を返す"
  - label: 呼び出し側がerrを確認する
    menuPath: "if err != nil"
    note: 都度チェックすることが前提の設計
  - label: 必要ならエラーをラップする
    menuPath: "fmt.Errorf(\"context: %w\", err)"
    note: 元のエラー情報を保持したまま文脈を追加できる
  - label: errors.Is/Asで種別を判定する
    note: ラップされていても元のエラーの種類を判定できる
---

## 概要

多くの言語が`try`/`catch`で例外を扱うのに対し、Goには例外機構がなく、エラーは関数の戻り値として明示的に返す。エラーが起きうる処理は慣習的に`(結果, error)`という2値を返し、呼び出し側は`if err != nil`でその都度チェックする。

## 基礎文法

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("ゼロ除算はできません")
    }
    return a / b, nil
}

result, err := divide(10, 0)
if err != nil {
    log.Fatal(err) // エラーを都度チェックする
}
fmt.Println(result)
```

## つまずきやすい点

- `if err != nil`のチェックがコードのあちこちに頻出し、他言語の例外処理に慣れているとくどく感じることがある。これはGoが「エラーを見えるところに明示的に置く」ことを意図的に選んだ設計思想であり、省略や握りつぶし(`_`でエラーを無視する)は推奨されない
- `errors.New`で作った素朴なエラーは文字列としてしか判定できない。エラーの種類ごとに異なる対処をしたい場合は、`errors.Is`/`errors.As`や独自のエラー型を使うのが定石
- Go 1.13以降の`fmt.Errorf`で`%w`を使うと、元のエラーをラップしたまま新しい文脈を追加できる。ラップを使わず文字列連結でエラーメッセージを組み立てると、元のエラーの型情報が失われ、呼び出し元でのエラー種別判定ができなくなる

## 実装例(コード)

```go
var ErrNotFound = errors.New("見つかりません")

func findEntry(id string) (*Entry, error) {
    if !exists(id) {
        return nil, fmt.Errorf("findEntry: %w", ErrNotFound) // 元のエラーをラップ
    }
    // ...
}

if errors.Is(err, ErrNotFound) { // ラップされていても判定できる
    // ...
}
```
