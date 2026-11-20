---
name: "プロジェクトとワークスペースの基礎(Maya)"
category: DCC
subcategory: "Maya"
summary: "Mayaのプロジェクトは、シーンやテクスチャの置き場所を決めたフォルダ構成。開く前にプロジェクトを設定すると、相対パスの参照が壊れにくい。"
claim: "Mayaは、プロジェクトのフォルダを基準にファイルを探す。作業の前に、プロジェクトを設定する。"
operationSteps:
  - label: "プロジェクトを新規作成する"
    note: "File > Project Window から、名前と置き場所を決めて、Accept で作成する"
  - label: "フォルダ構成ができる"
    note: "scenes(シーン)・sourceimages(テクスチャ)・images(レンダー結果)などのフォルダが作られる"
  - label: "プロジェクトを設定する"
    note: "File > Set Project で、作業するプロジェクトのフォルダを選ぶ"
  - label: "シーンを保存する"
    note: "既定の保存先は、設定中のプロジェクトの scenes フォルダになる"
  - label: "ファイルを相対パスで参照する"
    note: "テクスチャなどは、プロジェクトからの相対パスで記録され、フォルダごと移しても、参照が保たれやすい"
quiz:
  - question: "Mayaで、テクスチャ画像の既定の置き場所になるフォルダはどれか"
    choices:
      - "sourceimages"
      - "images"
      - "scenes"
    answer: 0
    explanation: "sourceimages がテクスチャなどの素材用。images はレンダリング結果の出力先、scenes はシーンファイルの置き場。"
---

## 概要

Mayaでは、作業ファイルをフォルダ構成ごと管理する単位を**プロジェクト**と呼ぶ。プロジェクトの設定(どのフォルダに何を置くか)は、プロジェクト直下の`workspace.mel`に保存される。シーンを開く前に、正しいプロジェクトを設定しておくと、テクスチャなどの参照が見つかりやすく、「リンク切れ」が起きにくくなる。

## 基礎文法

| フォルダ | 主に置くもの |
| --- | --- |
| scenes | シーンファイル(.ma / .mb) |
| sourceimages | テクスチャなどの素材画像 |
| images | レンダリング結果 |
| data | 書き出した各種データ |

- メニューは、File > Project Window(新規作成・編集)と File > Set Project(設定)
- 複数の案件を並行するときは、シーンを開く前に、いまどのプロジェクトが設定されているかを毎回確認する
- 書き出し(FBX)のフォルダは[FBXの書き出し](/foundations/maya-fbx-export-basics)で扱う

## つまずきやすい点

- プロジェクトを設定しないままシーンを開くと、テクスチャが見つからず、マテリアルが真っ黒や市松模様になることがある。まずプロジェクトを正しく設定してから、開き直す
- シーンファイルだけを他のPCに渡しても、素材が付いてこない。プロジェクトのフォルダごと渡す
- 日本語や空白を含むフォルダ名は、環境によって、ほかのツールで扱いにくい。英数字の名前にしておくほうが無難
- フォルダ構成の既定の項目や名前は、Mayaの版によって差がある。いま使っている版の Project Window で確認する

## 実装例(コード)

```python
import maya.cmds as cmds

# 現在のプロジェクトのルートフォルダを調べる
root = cmds.workspace(q=True, rootDirectory=True)
print(root)

# 「scenes」に当たるフォルダの名前(プロジェクトからの相対パス)を調べる
print(cmds.workspace(q=True, fileRuleEntry="scenes"))
```
