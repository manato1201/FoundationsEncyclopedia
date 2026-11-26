---
name: IaaS/PaaS/SaaSの違い
category: IT知識
subcategory: クラウド
masteryBadge: done
summary: クラウドサービスが「どこまでを提供者が管理し、どこからを利用者が管理するか」で分類する3つのモデル。
operationSteps:
  - label: IaaSはOS以上を自分で管理する
    note: 物理サーバーや仮想化基盤だけを提供者が管理する
  - label: PaaSはコードだけ書けば動く
    note: OSや実行環境の管理も提供者が担う
  - label: SaaSはアプリケーションをそのまま使う
    note: 利用者はデータの入力・利用のみを行う
  - label: 必要な管理範囲に応じて選ぶ
    note: 手軽さと自由度はトレードオフの関係にある
visual:
  kind: tiers
  question: "クラウドの提供者は、どこまで管理してくれる?"
  legend:
    - { key: saas, label: "SaaS", tone: green }
    - { key: paas, label: "PaaS", tone: blue }
    - { key: iaas, label: "IaaS", tone: violet }
    - { key: easy, label: "手軽さを取る", tone: cyan, mark: "手" }
    - { key: free, label: "自由度を取る", tone: amber, mark: "自" }
  scale: { label: "利用者が管理する範囲", ticks: ["狭い", "広い"] }
  columns: { value: "利用者", extra: "例" }
  tiers:
    - { id: saas, label: "SaaS", key: saas, bar: 12, value: "データだけ", extra: "Gmail・Slack" }
    - { id: paas, label: "PaaS", key: paas, bar: 40, value: "コード", extra: "Vercel・Heroku" }
    - { id: iaas, label: "IaaS", key: iaas, bar: 75, value: "OS から上", extra: "EC2 など" }
  gaps:
    - { id: toSaas, after: saas, label: "アプリ全体も提供者が管理する" }
    - { id: toPaas, after: paas, label: "OS と実行環境も提供者が管理する" }
  steps:
    - short: "IaaS"
      reveal: [iaas]
      focus: [iaas]
      verdict: "提供者は物理サーバーと仮想化基盤まで。OS のパッチやスケーリングの設定は利用者の仕事"
    - short: "PaaS"
      reveal: [paas]
      focus: [paas]
      gaps: [toPaas]
      verdict: "OS と実行環境も提供者が持つ。利用者はコードを置けば動く"
    - short: "SaaS"
      reveal: [saas]
      focus: [saas]
      gaps: [toSaas]
      verdict: "アプリも提供者のもの。利用者はデータを入れて使うだけ"
    - short: "選ぶ"
      state: { saas: easy, iaas: free }
      verdict: "○ 上ほど手軽、下ほど自由。自分で管理したい範囲に合わせて選ぶ"
  summary:
    columns: ["IaaS", "PaaS", "SaaS"]
    rows:
      - { label: "提供者が管理", cells: ["物理・仮想化基盤", "+ OS・実行環境", "アプリ全体"] }
      - { label: "利用者が管理", cells: ["OS・ミドルウェア・アプリ", "アプリのコード", "データの入力・利用"] }
      - { label: "手軽さ", cells: ["△ 設定が多い", "○ コードを置くだけ", "○ すぐ使える"] }
      - { label: "自由度", cells: ["○ OS から選べる", "△ 実行環境の範囲内", "× 機能は提供者しだい"] }
---

## 概要

クラウドサービスは、インフラからアプリケーションまでのどの層を提供者が管理するかによって、IaaS・PaaS・SaaSという3つのモデルに分類されることが多い。上に行くほど利用者が管理する範囲は狭くなり、手軽さが増す代わりに自由度は下がる。

## 基礎文法

| モデル | 提供者が管理する範囲                   | 利用者が管理する範囲               | 代表例                         |
| ------ | -------------------------------------- | ---------------------------------- | ------------------------------ |
| IaaS   | 物理サーバー、ネットワーク、仮想化基盤 | OS、ミドルウェア、アプリケーション | AWS EC2、Google Compute Engine |
| PaaS   | 上記に加えOS、実行環境                 | アプリケーションのコードのみ       | Vercel、Heroku                 |
| SaaS   | アプリケーション全体                   | データの入力・利用のみ             | Gmail、Slack                   |

## つまずきやすい点

- 「クラウドだから自動でスケールする」「クラウドだから安全」という誤解が起きやすいが、実際に何が自動化されているかはサービスモデルによって大きく異なる。IaaSではOSのパッチ適用やスケーリングの設定まで利用者側の責任範囲になる
- Next.jsアプリをVercelにデプロイする本図鑑の構成はPaaSに近い。サーバーのプロビジョニングやOSの管理を意識せずに、コードをpushするだけでデプロイできる点がPaaSの利点として現れている
- 「責任共有モデル」という考え方があり、クラウド提供者と利用者のどちらがどのセキュリティ対策に責任を持つかは、選んだサービスモデルによって境界線が変わる。IaaSを使う場合、OSレベルの脆弱性対応は利用者の責任になることが多い

## 実装例(コード)

このエントリはサービス分類の整理が主題のため、コード例の代わりに上記の比較表で違いを説明しています。
