---
name: for/whileループの基礎
category: プログラミング言語
subcategory: Python
masteryBadge: done
summary: Pythonのfor文はC系言語と発想が異なり「イテラブルを順に取り出す」ことに特化している。
---

## 概要

Pythonの`for`文は、C#/C++のような「初期化・条件・更新」を書く形式([forループの実行フロー](/foundations/for-loop-flow)参照)ではなく、「イテラブル(リストや`range`等)から要素を順に取り出す」ことに特化した構文。回数を指定した繰り返しをしたい場合は`range()`と組み合わせる。

## 基礎文法

```python
# for: イテラブルから要素を順に取り出す
for score in [90, 80, 70]:
    print(score)

# 回数を指定した繰り返しはrange()と組み合わせる
for i in range(5):  # 0, 1, 2, 3, 4
    print(i)

# while: 条件が満たされる間繰り返す
hp = 100
while hp > 0:
    hp -= 10

# for-elseという珍しい構文: breakされずにループが終わった場合だけelseが実行される
for item in items:
    if item == target:
        break
else:
    print("見つかりませんでした")
```

## つまずきやすい点

- Pythonには、C系言語のような`for (int i = 0; i < n; i++)`という書き方がない。「インデックスが必要な場合はrange()やenumerate()を使う」という発想の転換が、C系言語出身者には最初のハードルになりやすい
- `for-else`構文の`else`は「ループがbreakされずに正常終了した場合」に実行される、という直感に反する意味を持つ。「elseはif文専用」という思い込みがあると、この構文の意図を誤解しやすい
- ループ変数(`for i in range(5)`の`i`)は、ループを抜けた後もスコープに残り続ける。C#やJavaのようにブロックスコープで閉じられないため、ループの外で同名の変数を意図せず上書きしてしまうことがある

## 実装例(コード)

```python
# enumerate()でインデックスと値を同時に取得する典型パターン
items = ["Sort", "Search", "Tree"]
for i, item in enumerate(items):
    print(f"{i}: {item}")
```
