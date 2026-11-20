---
name: "公開鍵暗号とデジタル署名の基礎"
category: IT知識
subcategory: "セキュリティ"
summary: "公開してよい鍵と、秘密にする鍵の組を使う暗号。暗号化にも、本人確認(署名)にも使われ、HTTPSやSSHの土台になっている。"
claim: "公開鍵は配ってよい。秘密鍵は渡さない。署名は秘密鍵で作り、公開鍵で確かめる。"
operationSteps:
  - label: "鍵のペアを作る"
    note: "秘密鍵と公開鍵が、数学的に対になって作られる。秘密鍵は自分だけが持ち、公開鍵は配ってよい"
  - label: "公開鍵で暗号化する"
    note: "相手の公開鍵でデータを暗号化する。これを元に戻せるのは、対になる秘密鍵だけ"
  - label: "秘密鍵で復号する"
    note: "受け取った側が、自分の秘密鍵で復号する。途中で盗み見られても、読めない"
  - label: "秘密鍵で署名する"
    note: "送り手が、データに対して秘密鍵で署名を作る。署名は、データとセットで送る"
  - label: "公開鍵で署名を検証する"
    note: "受け取った側が公開鍵で確かめる。データが改ざんされていれば、検証に失敗する"
quiz:
  - question: "デジタル署名を作るのに使う鍵と、検証に使う鍵の組み合わせは、どれか"
    choices:
      - "作成は公開鍵、検証は秘密鍵"
      - "作成は秘密鍵、検証は公開鍵"
      - "作成も検証も同じ共通鍵"
    answer: 1
    explanation: "署名は、秘密鍵を持つ本人しか作れない。誰でも持てる公開鍵で、本人が作ったものと確かめられる。"
---

## 概要

共通の鍵で暗号化と復号をする方式(共通鍵暗号)には、「鍵を安全にどう渡すか」という問題がある。**公開鍵暗号**は、対になった2つの鍵を使ってこれを解く。**公開鍵**は誰に見せてもよく、**秘密鍵**は持ち主だけが保管する。暗号化とは別に、データの作成者と改ざんの有無を確かめる**デジタル署名**にも使われる。ハッシュとの違いは[ハッシュ化と暗号化の違い](/foundations/hashing-vs-encryption)を参照。

## 基礎文法

| 目的 | 作る側の鍵 | 確かめる・戻す側の鍵 |
| --- | --- | --- |
| 秘密にして送る(暗号化) | 受け手の公開鍵 | 受け手の秘密鍵 |
| 本人が作ったと示す(署名) | 送り手の秘密鍵 | 送り手の公開鍵 |

- 代表的な方式には、RSA・楕円曲線暗号(ECDSA・Ed25519 など)がある
- 公開鍵暗号は計算が重いため、実際の通信(HTTPSなど)では、公開鍵暗号で共通鍵を安全に決め、その後の大量のデータは、速い共通鍵暗号で運ぶ([HTTPSとTLSの基礎](/foundations/https-tls-basics))
- 公開鍵が本人のものであることは、証明書で保証する([SSL/TLS証明書の基礎](/foundations/https-certificate-basics))

## つまずきやすい点

- 秘密鍵が漏れると、すべてが崩れる。メールやチャットで送らず、Gitにも入れない。漏れたら、鍵を作り直して、古い鍵を無効にする
- 公開鍵は配ってよいが、「その公開鍵が本当に相手のものか」を確かめないと、偽の鍵を渡されるおそれがある。証明書や、事前の照合が必要
- 署名は、データを秘密にするものではない。内容は誰でも読める状態のまま、改ざんがないことと作成者を確かめるもの
- 方式ごとに、鍵の長さの目安や推奨が変わる。新しく選ぶときは、公式の最新の指針を確認する

## 実装例(コード)

```bash
echo "hello" > msg.txt

openssl genpkey -algorithm ed25519 -out priv.pem          # 秘密鍵を作る
openssl pkey -in priv.pem -pubout -out pub.pem            # 公開鍵を取り出す

# 秘密鍵で署名する
openssl pkeyutl -sign -inkey priv.pem -rawin -in msg.txt -out sig.bin
# 公開鍵で検証する
openssl pkeyutl -verify -pubin -inkey pub.pem -rawin -in msg.txt -sigfile sig.bin
# => Signature Verified Successfully

echo "hellO" > msg.txt   # 内容を改ざんすると...
openssl pkeyutl -verify -pubin -inkey pub.pem -rawin -in msg.txt -sigfile sig.bin
# => Signature Verification Failure
```
