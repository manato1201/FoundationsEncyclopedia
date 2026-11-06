---
name: "pingとtracerouteの基礎"
category: IT知識
subcategory: "ネットワーク"
summary: "pingは相手に届くかと往復の時間を、tracerouteは相手までに通る経路を調べるコマンド。"
claim: "pingは届くかを、tracerouteはどこを通るかを調べる。"
operationSteps:
  - label: "調べたい相手を決める"
    note: "ホスト名またはIPアドレスを用意する"
  - label: "pingで届くかを確かめる"
    note: "相手に小さな確認の信号(ICMPのエコー)を送り、返事が来るかと、往復にかかった時間を測る"
  - label: "返事が来ないときは経路を調べる"
    note: "tracerouteで、相手までに通るルーターを順に表示する"
  - label: "TTLを1ずつ増やして送る"
    note: "寿命(TTL)を1ずつ増やした信号を送ると、途中のルーターが順に自分の存在を返してくる"
  - label: "遅れや途切れの場所を探す"
    note: "どの区間で遅くなる、または返事が途切れるかを手がかりに、原因の場所を絞る"
quiz:
  - question: "tracerouteが、途中のルーターを順に調べられる理由として近いものはどれか"
    choices:
      - "TTL(寿命)を1ずつ増やした信号を送るから"
      - "相手のパスワードを読み取るから"
      - "ファイルを直接コピーするから"
    answer: 0
    explanation: "TTLが0になったルーターは信号を捨てて、自分の存在を返す。それを順に集めると経路が分かる。"
---

## 概要

**ping**は、相手のコンピューターに小さな確認の信号を送り、返事が届くかと、往復にかかった時間を調べる。**traceroute**は、相手までに通るルーターを順に表示する。通信がつながらない、遅いといったときの、最初の切り分けに使う。

## 基礎文法

| コマンド | わかること | 例 |
| --- | --- | --- |
| ping | 届くか・往復の時間 | `ping -c 4 example.com` |
| traceroute(Windowsは tracert) | 相手までに通る経路 | `traceroute example.com` |

## つまずきやすい点

- pingの返事がないからといって、相手が止まっているとは限らない。セキュリティの設定で、pingに応答しない機器もある
- tracerouteで「* * *」と出る行は、その機器が応答しないという意味で、必ずしも故障ではない
- 往復の時間は、そのときの混み具合で変わる。1回の値ではなく、何回か測って傾向を見る

## 実装例(コード)

```bash
ping -c 4 example.com
traceroute example.com   # Windowsでは tracert example.com
```
