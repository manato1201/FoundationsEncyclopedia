---
name: "配列の基礎(PHP)"
category: プログラミング言語
subcategory: "PHP"
summary: "PHPの配列は、番号で並べるリストにも、キーで引く連想配列にもなる1つの型。array_map や array_filter で変換・絞り込みができる。"
claim: "PHP の配列は、リストと連想配列を兼ねる1つの型。filter では、キーが保たれる。"
operationSteps:
  - label: "配列を作る"
    note: "`$names = ['Ann', 'Bob'];`(番号で並ぶ)や、`$prices = ['pen' => 100];`(キーで引く)と書く"
  - label: "要素を追加・更新する"
    note: "`$names[] = 'Cid';` で末尾に追加。`$prices['bag'] = 3000;` でキーを指定して追加・更新する"
  - label: "要素を読む"
    note: "`$names[0]`、`$prices['pen']`。存在しないキーを読むと、警告が出る(`??` で既定値を使える)"
  - label: "foreachで全部を回す"
    note: "`foreach ($prices as $item => $price)` で、キーと値を取り出す"
  - label: "map・filterで加工する"
    note: "`array_map` は変換、`array_filter` は絞り込み。どちらも新しい配列を返す"
quiz:
  - question: "array_filter で絞り込んだ配列の、キーはどうなるか"
    choices:
      - "元のキーが保たれる"
      - "0から振り直される"
      - "すべて文字列になる"
    answer: 0
    explanation: "array_filter は元のキーを保つ。番号を振り直したいときは、array_values を通す。"
---

## 概要

PHPの配列は、**番号で並べるリスト**と、**キーで値を引く連想配列**を、同じ`array`という1つの型で扱う。内部では、順序付きの対応表になっている。Webアプリでは、フォームの入力やデータベースの結果、JSONの変換結果など、あらゆる場面で使われる。

## 基礎文法

```php
<?php
$names = ['Ann', 'Bob'];
$names[] = 'Cid';                       // 末尾に追加
echo count($names);                     // 3

$prices = ['pen' => 100, 'book' => 800];
$prices['bag'] = 3000;
echo $prices['pen'];                    // 100
echo $prices['cup'] ?? 0;               // 存在しないキー: 0(既定値)

foreach ($prices as $item => $price) {
    echo "$item: $price\n";
}
```

| 関数 | 働き |
| --- | --- |
| `count($a)` | 要素数 |
| `isset($a['k'])` | キーが存在し、`null`でない |
| `array_key_exists('k', $a)` | キーが存在する(値が`null`でもtrue) |
| `array_keys($a)` / `array_values($a)` | キーだけ / 値だけの配列 |
| `in_array($v, $a)` | 値が含まれるか |

## つまずきやすい点

- 存在しないキーを読むと、警告が出る。`??`や`isset`で先に確認する
- 配列は、代入すると値としてコピーされる(参照ではない)。関数に渡して中で変更しても、呼び出し元は変わらない。変えたいときは、参照渡し(`&$arr`)にする
- `array_filter`は、元のキーを保つ。結果の番号が飛ぶので、振り直すには`array_values`を使う
- `in_array`は、既定では型を厳密に比べない。厳密にするには、第3引数に`true`を渡す

## 実装例(コード)

```php
<?php
$prices = ['pen' => 100, 'book' => 800, 'bag' => 3000];

// 500円以上だけに絞る(キーは保たれる)
$expensive = array_filter($prices, fn($p) => $p >= 500);
echo implode(',', array_keys($expensive));   // book,bag

// 税込みの値に変換する
$withTax = array_map(fn($p) => (int) round($p * 1.1), $prices);
echo $withTax['pen'];                        // 110
```
