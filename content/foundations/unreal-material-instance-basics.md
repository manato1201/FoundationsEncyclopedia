---
name: "マテリアルインスタンスの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "元のマテリアルの、パラメーターだけを変えた派生を作る。色違いなどを軽く作れる。"
operationSteps:
  - label: "元になるマテリアルを作る"
    note: "色や粗さなどを、パラメーターとして公開した、マテリアルを作る"
  - label: "パラメーターを公開する"
    note: "変えたい値を、パラメーターノードにして、名前を付ける"
  - label: "マテリアルインスタンスを作る"
    note: "元のマテリアルを親にして、インスタンスを作る"
  - label: "値を変えて、色違いを作る"
    note: "インスタンスでは、パラメーターの値だけを変える"
  - label: "実行中に値を変える"
    note: "動的なインスタンスを使うと、実行中にも、値を変えられる"
---

## 概要

**マテリアルインスタンス**は、元の**マテリアル(親)のパラメーターだけを変えた**、派生。構造は親と同じなので、色違いや、質感違いを、軽く、素早く作れる。親を直すと、派生にも反映される。

## 基礎文法

| 種類 | 特徴 |
| --- | --- |
| Material Instance Constant | エディタで値を決める(実行中は固定) |
| Material Instance Dynamic | 実行中に値を変えられる |

## つまずきやすい点

- 親のマテリアルで、パラメーターとして公開していない値は、インスタンスでは変えられない
- 動的なインスタンスを大量に作ると、負荷が増える。必要な数に絞る
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
UMaterialInstanceDynamic* Mid = Mesh->CreateAndSetMaterialInstanceDynamic(0);
Mid->SetVectorParameterValue(TEXT("Color"), FLinearColor::Red);
```
