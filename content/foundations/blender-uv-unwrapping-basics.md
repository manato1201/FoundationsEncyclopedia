---
name: UV展開の基礎(Blender)
category: DCC
subcategory: Blender
masteryBadge: done
summary: MayaでのUV展開と同じ目的を、Blender独自の操作手順で行う。
operationSteps:
  - label: シームをマークする
    menuPath: Edge > Mark Seam
    note: メッシュを切り開く境界線を指定する
  - label: 全選択してUnwrapする
    menuPath: UV > Unwrap
    note: シームに沿って自動的に2D平面へ展開される
  - label: UV Editorでレイアウトを確認する
    note: UVシェルが重なっていないか、歪みが大きすぎないかを確認する
  - label: Pack Islandsで効率よく配置し直す
    menuPath: UV > Pack Islands
    note: 複数のUVシェルをUVスペース内に無駄なく詰め直す
---

## 概要

UV展開の目的自体は[MayaでのUV展開の基礎](/foundations/maya-uv-unwrapping)と共通しており、3Dメッシュの表面を2Dのテクスチャ座標に対応付ける作業。Blenderではシームのマーク→Unwrap→レイアウト調整という一連の流れが、専用のUV Editorワークスペースで完結するよう設計されている。

## 操作手順(OperationSteps)

frontmatterの`operationSteps`に記載した4手順が、詳細ページのCSSステップアニメーションと連動して表示されます。

## つまずきやすい点

- Unwrap前にシームを1つも指定しないと、Blenderは自動的な推測でメッシュ全体を1つの塊として無理やり展開しようとし、大きな歪みが発生することが多い。意図した箇所にシームを指定することが品質の鍵になる
- Pack Islandsを実行すると、既存のUVレイアウトの配置がリセットされ、自動的な最適配置に置き換わる。手動で細かく調整したレイアウトがある場合、意図せず上書きされてしまうことがある
- UV Editor上での歪みの確認には、チェッカーパターンのテクスチャを仮に貼り付けて視覚的に確認する方法がよく使われる。数値だけでは歪みの程度を直感的に把握しにくい

## 実装例(コード)

このエントリはBlenderの実際の操作手順が主題のため、コード例の代わりに`operationSteps`のCSSステップアニメーションで手順を可視化しています。
