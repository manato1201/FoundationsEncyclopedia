"""docs/diagrams/ の構成図(SVG)を作る。`python tools/make_diagrams.py` で作り直す。部品は tools/svgkit.py。"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from svgkit import Diagram  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "docs" / "diagrams"


def architecture() -> Diagram:
    d = Diagram(1560, 780, "FoundationsEncyclopedia の構成",
                "基礎知識の図鑑。content/foundations の Markdown(frontmatter の operationSteps・quiz・guide)をローダーが読み、"
                "step-scene(純粋関数)が章ごとの図の型を決め、平面(SVG)か立体(three.js)で手順を見せる。"
                "クイズの復習記録はブラウザの localStorage にだけ保存する。")
    d.text(40, 44, "FoundationsEncyclopedia — 構成", cls="hd")
    d.text(40, 66, "青=主な流れ / 灰の破線=補助。章は Markdown、図の型は規則表、保存はブラウザの中だけ", cls="note")

    d.group(40, 100, 300, 600, "CONTENT", color="orange")
    md = d.card(190, 250, "doc", "content/foundations", "章 495 件(Markdown)\n手順・クイズ・ガイドは frontmatter")
    up = d.card(190, 470, "list", "updates.ts", "更新履歴(手書きの静的データ)")

    d.group(400, 100, 380, 600, "LIB — 純粋関数", color="teal")
    ss = d.card(590, 220, "branch", "step-scene.ts", "章の id → 図の型\n(平面 2 種・立体 6 種)")
    ch = d.card(590, 400, "tag", "chapter-links・\nchapter-sections", "本文のリンクから章の地図\n本文を解説 / 例に分ける")
    gs = d.card(590, 580, "check", "guess・ascii-crystal", "先に予想・ASCII の結晶\n(乱数も時刻も使わない)")

    d.group(840, 100, 360, 600, "APP — Next.js(静的生成)", color="blue")
    ld = d.card(1020, 220, "server", "createContentLoader", "メタ・本文 HTML\n(gray-matter・marked)")
    pg = d.card(1020, 400, "browser", "カタログ・章ページ", "/foundations/[id]\n解説・例・クイズ")
    sc = d.card(1020, 580, "film", "手順の図", "平面: SVG(FlowScene)\n立体: three.js(動的読み込み)")

    d.group(1260, 100, 260, 600, "BROWSER", color="gray")
    ls = d.card(1390, 300, "db", "localStorage", "復習記録 fe-review-v1\n好み fe-scene-view など")

    d.arrow([md.top, (190, 150), (930, 150), (930, 220), ld.left], "読む", at=1, dy=-10)
    d.arrow([ld.right, (1140, 220), (1140, 340), (1020, 340), pg.top], "")
    d.arrow([ss.right, (810, 220), (810, 400), pg.left], "図の型", at=1, dx=0, dy=0)
    d.arrow([gs.right, (810, 580), sc.left], "", at=0)
    d.arrow([pg.right, (1230, 400), (1230, 300), ls.left], "復習を保存", kind="secondary", at=1, dx=0, dy=0)
    d.arrow([ch.left, (370, 400), (370, 150)], "", kind="secondary")
    return d


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "architecture.svg").write_text(architecture().svg(), encoding="utf-8")
    print("wrote", OUT / "architecture.svg")


if __name__ == "__main__":
    main()
