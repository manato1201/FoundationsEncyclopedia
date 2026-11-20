---
name: "辞書(dict)の基礎"
category: プログラミング言語
subcategory: "Python"
summary: "キーと値の組を保持するデータ構造。キーから値をすぐに引け、挿入した順序も保たれる。"
claim: "辞書は、キーで値を引く。リストは位置で引く。"
operationSteps:
  - label: "キーと値の組で辞書を作る"
    note: "`score = {\"alice\": 80, \"bob\": 65}` のように、`キー: 値` を並べる"
  - label: "キーで値を読む"
    note: "`score[\"alice\"]` で 80 が得られる。存在しないキーは KeyError になる"
  - label: "getで安全に読む"
    note: "`score.get(\"carol\", 0)` は、キーがなければ指定した既定値を返す"
  - label: "代入で追加・更新する"
    note: "`score[\"carol\"] = 90` は、キーがなければ追加、あれば値を置き換える"
  - label: "items()で全部を回す"
    note: "`for name, point in score.items():` で、キーと値を1組ずつ取り出せる"
quiz:
  - question: "辞書のキーとして使えないものはどれか"
    choices:
      - "リスト(list)"
      - "文字列(str)"
      - "タプル(tuple、中身が文字列や数値のみ)"
    answer: 0
    explanation: "キーはハッシュ可能でなければならない。変更できるリストは使えず、変更できないタプルや文字列は使える。"
---

## 概要

辞書(`dict`)は、**キー**と**値**を組にして持つデータ構造で、キーを指定して値を直接取り出せる。リストが「何番目か」で要素を探すのに対し、辞書は「何という名前か」で探す。内部はハッシュテーブル([ハッシュテーブルの基礎](/foundations/hash-table-basics))で、要素が増えても、引く速さはほとんど変わらない。

## 基礎文法

```python
score = {"alice": 80, "bob": 65}

print(score["alice"])        # 80
print(score.get("carol", 0)) # 0(キーがないので既定値)
score["carol"] = 90          # 追加
del score["bob"]             # 削除
print("alice" in score)      # True(キーの存在確認)
```

- `keys()`・`values()`・`items()`で、キー・値・組を取り出せる
- Python 3.7以降は、キーを入れた順序が保たれることが言語の仕様になっている

## つまずきやすい点

- 存在しないキーを`[]`で読むと`KeyError`になる。あるか分からないときは、`get`か`in`で確かめる
- キーにできるのは、ハッシュ可能な(変更できない)値。リストや辞書はキーにできないが、文字列・数値・タプルはできる
- ループ中に、その辞書へキーを追加・削除すると、`RuntimeError`になる。必要なら`list(d.items())`でコピーしてから回す
- 順序が保たれるといっても、位置の番号(`d[0]`)で引けるわけではない。`d[0]`はキー`0`を探す

## 実装例(コード)

```python
# 文字の出現回数を数える
text = "banana"
counts = {}
for ch in text:
    counts[ch] = counts.get(ch, 0) + 1
print(counts)  # {'b': 1, 'a': 3, 'n': 2}

# 値の大きい順に並べる
for ch, n in sorted(counts.items(), key=lambda kv: kv[1], reverse=True):
    print(ch, n)
```
