---
name: "ログの書き方の基礎(レベルと構造化)"
category: IT知識
subcategory: "ソフトウェア工学・開発プロセス"
summary: "プログラムの動きを記録するログは、重要度のレベルと、後から検索しやすい形で書く。秘密の情報は、書かない。"
claim: "ログは、書く量でなく、使えるかで決める。レベルを分け、必要な文脈を添え、秘密は書かない。"
operationSteps:
  - label: "何を知りたいかを決める"
    note: "障害のとき、原因をたどるために、どの出来事の記録が必要かを先に考える"
  - label: "重要度のレベルを付ける"
    note: "DEBUG(開発用の詳細)・INFO(通常の出来事)・WARNING(注意)・ERROR(失敗)などに分けて書く"
  - label: "文脈を添える"
    note: "日時・リクエストID・ユーザーID(個人が特定されない形)・対象のIDなど、原因を追える情報を添える"
  - label: "出力先とレベルを設定する"
    note: "本番は INFO 以上、調査時だけ DEBUG、のように、設定で切り替える。出力先はファイルや、集約サービスにする"
  - label: "秘密を書かない"
    note: "パスワード・トークン・カード番号などは、ログに出さない。必要なら、一部を伏せる"
quiz:
  - question: "ログに出力してはいけないものはどれか"
    choices:
      - "リクエストID"
      - "処理にかかった時間"
      - "ユーザーのパスワード"
    answer: 2
    explanation: "パスワードやトークンなどの秘密は、ログから漏れやすい。出力しない、または伏せる。"
---

## 概要

**ログ**は、プログラムが動いた記録で、障害のときに「何が起きたか」をたどる、ほぼ唯一の手がかりになる。ただし、何でも書けばよいわけではない。多すぎると、必要な記録が埋もれ、保管の費用も増える。少なすぎると、原因を追えない。ログの考え方は、システム全体の観測([オブザーバビリティの基礎](/foundations/observability-basics))の土台になる。

## 基礎文法

| レベル | 意味 | 例 |
| --- | --- | --- |
| DEBUG | 開発時の詳細 | 変数の値、処理の分岐 |
| INFO | 通常の出来事 | 起動した、注文を受け付けた |
| WARNING | 問題になりうる状況 | 再試行した、設定が既定値だった |
| ERROR | 処理の失敗 | 保存できなかった |
| CRITICAL | 継続が難しい重大な失敗 | データベースに接続できない |

- 検索・集計をしやすくするため、1行を、キーと値の組(JSONなど)にする**構造化ログ**が、広く使われる
- 同じリクエストに関わる記録を、同じ**リクエストID**で結ぶと、複数のサービスをまたいで追える

## つまずきやすい点

- パスワード・トークン・APIキー・個人情報を、ログに書かない。エラーの内容を、そのまま出力するときも、含まれていないか確認する
- ERRORでないものにERRORを使うと、本当の失敗が埋もれる。レベルは、対応が必要かで決める
- 例外を握りつぶして、何も書かないと、原因が追えない。例外は、スタックトレースを含めて記録する
- ループの中で大量に出力すると、性能に影響し、ディスクを圧迫する。出す頻度を、考える

## 実装例(コード)

```python
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("shop")

def pay(order_id, amount):
    log.info(json.dumps({"event": "pay_start", "order_id": order_id, "amount": amount}))
    try:
        if amount <= 0:
            raise ValueError("金額が不正")
        log.info(json.dumps({"event": "pay_ok", "order_id": order_id}))
    except ValueError:
        log.exception(json.dumps({"event": "pay_failed", "order_id": order_id}))  # スタックトレース付き

pay(1, 500)
pay(2, 0)
log.debug("この行は INFO 以上の設定なので出力されない")
```
