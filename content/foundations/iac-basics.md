---
name: Infrastructure as Codeの基礎
category: IT知識
subcategory: クラウド
masteryBadge: advanced
summary: サーバーやネットワークの構成をコードとして記述し、バージョン管理・再現可能にする手法。
operationSteps:
  - label: インフラの構成をコードで記述する
    note: サーバー・ネットワーク等の定義をHCLやYAML等のファイルに書く
  - label: 差分をプランで確認する
    menuPath: "terraform plan"
    note: 実際に適用する前に、何が変更されるかを確認する
  - label: 変更を適用する
    menuPath: "terraform apply"
    note: プランに沿って実際のインフラへ変更が反映される
  - label: コードと実際の状態を同期させる
    note: 手動変更によるドリフトが起きないよう、常にコード経由で変更する運用を保つ
---

## 概要

IaC(Infrastructure as Code)は、サーバー・ネットワーク・データベースといったインフラの構成を、手作業でクラウドのコンソール画面から設定するのではなく、コード(設定ファイル)として記述する手法。[バージョン管理](/foundations/git-branch-workflow)の対象にでき、レビュー・差分の確認・再現可能な構築が可能になる。

## 基礎文法

```hcl
# Terraformでの記述例(HCLという専用の言語)
resource "aws_s3_bucket" "assets" {
  bucket = "my-app-assets"
}

resource "aws_instance" "web" {
  ami           = "ami-12345678"
  instance_type = "t3.micro"
}
```

- 代表的なツール: Terraform(マルチクラウド対応)、AWS CloudFormation(AWS専用)、Pulumi(汎用プログラミング言語で記述)

## つまずきやすい点

- IaCで管理しているはずのインフラを、緊急対応などで手動でコンソールから変更してしまうと、コード上の定義と実際の状態(ドリフト)がずれてしまう。次にIaCツールを実行した際に、意図しない変更が適用されたり、逆に手動変更が取り消されたりする事故につながる
- IaCの適用(`terraform apply`のようなコマンド)は、実際のインフラに対する破壊的変更を含みうる。適用前に「何が変更されるか」のプラン(差分)を必ず確認する運用が重要になる
- IaCのコード自体に秘密情報(APIキー、パスワード)を直書きしてしまうと、[バージョン管理](/foundations/gitignore-basics)のリポジトリに機密情報が残ってしまう。環境変数や専用のシークレット管理サービスと組み合わせるのが基本

## 実装例(コード)

```bash
terraform plan   # 適用前に変更内容を確認する
terraform apply  # 実際にインフラへ変更を適用する
```
