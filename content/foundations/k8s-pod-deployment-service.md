---
name: "Kubernetesの基本(Pod・Deployment・Service)"
category: IT知識
subcategory: "コンテナ・仮想化"
summary: "Podがコンテナを動かし、Deploymentが台数を保ち、Serviceが安定した入口を作る。"
claim: "Podは動かす単位、Deploymentは台数の維持、Serviceは入口。"
operationSteps:
  - label: "コンテナをPodにまとめる"
    note: "Podは、Kubernetesで動かす最小の単位。1つ以上のコンテナが入る"
  - label: "Deploymentで台数を決める"
    note: "「このPodを3つ動かす」と宣言する。Podが落ちたら、自動で作り直される"
  - label: "Podが各ノードに配置される"
    note: "Kubernetesが、空いている機器へPodを配置する"
  - label: "Serviceで入口を作る"
    note: "Podは入れ替わってアドレスが変わるため、安定した入口(Service)を用意する"
  - label: "Serviceが通信をPodへ振り分ける"
    note: "リクエストが、動いているPodのどれかへ振り分けられる"
quiz:
  - question: "Podが入れ替わってもアクセスできるように、安定した入口を作る部品はどれか"
    choices:
      - "Service"
      - "Image"
      - "Volume"
    answer: 0
    explanation: "Serviceが、動いているPodへ通信を振り分ける。"
---

## 概要

**Kubernetes**でコンテナを動かすときの、基本の3つの部品。**Pod**は、動かす最小の単位。**Deployment**は、Podの数を保ち、更新を管理する。**Service**は、入れ替わるPodの前に置く、安定した入口。

## 基礎文法

| 部品 | 役割 |
| --- | --- |
| Pod | コンテナを動かす最小の単位 |
| Deployment | Podの数を保つ・更新する |
| Service | Podへの安定した入口(振り分け) |

## つまずきやすい点

- Podは使い捨て。落ちたり入れ替わったりして、アドレスも変わる。直接のアドレスを使わず、Serviceを経由する
- Podを直接作ると、落ちたときに戻らない。通常は、Deploymentなどを通して作る
- 設定はYAMLで宣言し、「あるべき状態」をKubernetesが保つ、という考え方に慣れる

## 実装例(コード)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3            # Podを3つ保つ
  selector:
    matchLabels: { app: web }
  template:
    metadata:
      labels: { app: web }
    spec:
      containers:
        - name: web
          image: nginx:1.27
```
