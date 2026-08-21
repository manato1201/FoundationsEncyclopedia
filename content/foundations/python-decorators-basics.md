---
name: デコレータの基礎
category: プログラミング言語
subcategory: Python
masteryBadge: review
summary: 既存の関数を変更せずに、その前後に処理を追加できるPythonの構文糖衣。
operationSteps:
  - label: デコレータ関数を定義する
    note: 関数を受け取り、新しい関数を返す「関数を変換する関数」を用意する
  - label: 対象の関数に@をつけて適用する
    menuPath: "@measure_time"
    note: "load_all_entries = measure_time(load_all_entries) と同じ意味になる"
  - label: 元の関数を呼び出す
    note: 実際には内側のwrapper関数が呼ばれ、前後に処理が差し込まれる
  - label: 前後の処理を含めた結果が返る
    note: ログ出力や実行時間計測など、本来のロジックとは別の関心事が挟み込まれる
---

## 概要

デコレータは、関数(や場合によりクラス)を受け取り、新しい関数を返す「関数を変換する関数」。`@デコレータ名`という構文で既存の関数に適用でき、ログ出力・実行時間計測・キャッシュのような「本来のロジックとは別の関心事」を、元の関数の中身を変えずに差し込める。

## 基礎文法

```python
import time
from functools import wraps

def measure_time(func):
    @wraps(func)  # 元の関数の名前・docstringを保持する
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__}: {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

@measure_time
def load_all_entries():
    ...
```

- `@measure_time`は`load_all_entries = measure_time(load_all_entries)`のシンタックスシュガー

## つまずきやすい点

- `@wraps(func)`を付け忘れると、デコレートされた関数の`__name__`や`__doc__`がラッパー関数のものに置き換わってしまい、デバッグ時に元の関数が何なのか分かりにくくなる
- デコレータを複数重ねる場合、適用される順序は「下から上」(コードに近い方から先に適用)になる。読む順序と適用順序が逆になる点を意識していないと混乱しやすい
- 引数を取るデコレータ(`@retry(times=3)`のような形)を書く場合、関数を返す関数をさらにもう1段階ラップする必要があり、ネストが深くなりがち

## 実装例(コード)

```python
def retry(times: int):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception:
                    if attempt == times - 1:
                        raise
        return wrapper
    return decorator
```
