---
name: コンテナオーケストレーションの基礎(Kubernetes入門)
category: IT知識
subcategory: コンテナ・仮想化
masteryBadge: advanced
summary: 多数のコンテナの起動・停止・スケーリング・障害復旧を自動管理する仕組み。Kubernetesが代表格。
operationSteps:
  - label: 望ましい状態を宣言する
    menuPath: "Deployment(replicas: 3)"
    note: 「このPodを何個維持するか」を宣言的に定義する
  - label: スケジューラがノードに配置する
    note: 利用可能なサーバー群の中から実行先を自動的に選ぶ
  - label: ヘルスチェックで稼働を監視する
    note: 各Podが正常に応答するか継続的に確認する
  - label: 落ちたPodを自動的に再起動する
    note: 実際の状態が宣言した状態と異なれば自動的に調整される
---

## 概要

コンテナオーケストレーションは、本番環境で多数のコンテナを運用する際に、「どのサーバーでどのコンテナを何個動かすか」「故障したコンテナをどう検知して再起動するか」「負荷に応じてどう増減させるか」といった管理を自動化する仕組み。Kubernetes(K8s)が事実上の標準として広く使われている。

## 基礎文法

```yaml
# Kubernetesの基本的なリソース定義の例(Deployment)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3 # 常に3つのPod(コンテナの実行単位)を維持する
  template:
    spec:
      containers:
        - name: my-app
          image: my-app:1.0.0
```

- **Pod**: Kubernetesにおけるコンテナの実行単位(1つ以上のコンテナのグループ)
- **Deployment**: 「このPodを何個、どのように維持するか」を宣言的に定義するリソース

## つまずきやすい点

- Kubernetesは「宣言的」な設定モデルを採る。「今すぐこのコマンドを実行せよ」ではなく「この状態を維持せよ」と宣言し、実際の状態がそれと異なれば自動的に調整される(あるPodが落ちれば自動的に新しいPodが起動する)。この考え方に慣れるまでは、命令的なスクリプトに慣れた開発者にとって直感的でないことがある
- Kubernetesは学習コストが非常に高く、小規模なプロジェクトにいきなり導入すると、その運用の複雑さ自体がボトルネックになることがある。[サーバーレス](/foundations/serverless-basics)やシンプルなPaaS([IaaS/PaaS/SaaSの違い](/foundations/cloud-service-models))で十分な規模であれば、無理にKubernetesを導入する必要はない
- YAMLファイルの設定ミス(インデントの誤り、リソース名の重複等)は、実際にクラスタに適用してから初めて問題が顕在化することも多い。`kubectl apply --dry-run`のような事前検証の仕組みを活用するのが実務的

## 実装例(コード)

```bash
kubectl apply -f deployment.yaml   # 定義をクラスタに適用する
kubectl get pods                    # 現在のPodの状態を確認する
kubectl scale deployment my-app --replicas=5  # レプリカ数を手動で変更する
```
