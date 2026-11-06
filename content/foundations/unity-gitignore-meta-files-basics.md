---
name: "Unityプロジェクトのバージョン管理の基礎(.gitignoreと.meta)"
category: ツール別
subcategory: "Unity"
summary: "Gitで管理するもの・しないものを分ける。.metaファイルは必ず含める。"
operationSteps:
  - label: "管理しないものを決める"
    note: "Library・Temp・Logsなど、再生成できるフォルダを、管理の対象から外す"
  - label: ".gitignoreを用意する"
    note: "Unity向けの.gitignoreを用意して、リポジトリに置く"
  - label: ".metaファイルを含める"
    note: "アセットの識別子を持つ.metaは、必ずコミットに含める"
  - label: "テキストでの保存を設定する"
    note: "シーンやPrefabが、テキスト形式で保存されるようにして、差分を見やすくする"
  - label: "チームで同じ設定にそろえる"
    note: "Meta ファイルの扱いなどの設定を、全員で同じにする"
---

## 概要

Unityのプロジェクトをgitで管理するときは、**再生成できるもの**(Library・Tempなど)を**除外**し、**.metaファイルは含める**。.metaには、アセットの識別子が入っていて、なくなると、参照が切れる。

## 基礎文法

| 管理の対象 | 扱い |
| --- | --- |
| Assets / Packages / ProjectSettings | 含める |
| Library / Temp / Logs / Obj | 除外する(再生成できる) |
| .meta | 含める(アセットの識別子) |

## つまずきやすい点

- .metaを含め忘れると、別の人の環境で、参照が切れる
- 大きなバイナリ(動画・音声・モデルなど)が多い場合は、Git LFSなどの利用を検討する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```text
# .gitignore の例(抜粋)
[Ll]ibrary/
[Tt]emp/
[Ll]ogs/
[Oo]bj/
# .meta はコミットする(除外しない)
```
