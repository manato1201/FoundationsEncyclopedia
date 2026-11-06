---
name: "sedとawkの基礎"
category: IT知識
subcategory: "Linux・シェル操作"
summary: "sedは文字列の置換、awkは列ごとの処理をする、テキスト加工の定番コマンド。"
claim: "sedは置き換え、awkは列の処理。"
operationSteps:
  - label: "加工したいテキストを用意する"
    note: "ファイルや、パイプで渡された出力が対象"
  - label: "置き換えるならsedを使う"
    note: "`sed 's/旧/新/g'` で、行ごとに、文字列を置き換える"
  - label: "列を取り出すならawkを使う"
    note: "`awk '{print $2}'` で、空白で区切った2列目を取り出す"
  - label: "条件を付けて絞る"
    note: "awkでは、`$3 > 100` のように、条件に合う行だけを処理できる"
  - label: "パイプでつないで組み合わせる"
    note: "ほかのコマンドの出力を、sedやawkに渡して、加工を重ねる"
quiz:
  - question: "テキストの列を取り出すのに向いているコマンドはどれか"
    choices:
      - "awk"
      - "ls"
      - "cd"
    answer: 0
    explanation: "awkは、行を列に分けて処理できる。"
---

## 概要

**sed**は、テキストの**置換**や削除などを行うコマンド。**awk**は、テキストを**列**に分けて、取り出す・集計するコマンド。ログやCSVを、素早く加工するときによく使う。

## 基礎文法

| コマンド | 例 | 意味 |
| --- | --- | --- |
| sed | `sed 's/error/ERROR/g' a.log` | 文字列の置き換え |
| awk | `awk '{print $1}' a.log` | 1列目を表示する |
| awk | `awk '{s += $2} END {print s}'` | 2列目の合計を出す |

## つまずきやすい点

- `sed -i` はファイルを直接書き換える。実行前に、バックアップを取るか、`-i.bak` で退避する
- awkの `$1` はシェルの変数ではなく、awkの列番号。シングルクォートで囲んで、シェルに解釈されないようにする
- 区切り文字が空白以外(CSVなど)のときは、`awk -F,` のように、区切りを指定する

## 実装例(コード)

```bash
echo "alice 30" | sed 's/alice/Alice/'      # Alice 30
echo "alice 30" | awk '{print $2}'          # 30
awk -F, '{print $1}' data.csv                  # CSVの1列目
```
