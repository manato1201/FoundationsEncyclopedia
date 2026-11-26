"use client";

import type { VisualSpec } from "@/lib/visual/schema";
import { ZonesView } from "@/components/visual-kinds/ZonesView";
import { TiersView } from "@/components/visual-kinds/TiersView";
import { CompareView } from "@/components/visual-kinds/CompareView";
import { GridView } from "@/components/visual-kinds/GridView";
import { SequenceView } from "@/components/visual-kinds/SequenceView";
import { GraphView } from "@/components/visual-kinds/GraphView";
import palette from "@/components/visual-kinds/palette.module.css";
import styles from "./VisualStage.module.css";

type VisualStageProps = {
  spec: VisualSpec;
  step: number;
  /** 縮小の静止コマ(カード)。動きを止め、読み上げから外す */
  still?: boolean;
};

/** visual.kind で描画コンポーネントを出し分ける(章ページのプレイヤーとカードの縮小コマで共通) */
export function VisualStage({ spec, step, still = false }: VisualStageProps) {
  return (
    <div
      className={`${palette.palette} ${styles.stage} ${still ? palette.still : ""}`}
      data-kind={spec.kind}
      aria-hidden={still ? true : undefined}
    >
      <KindView spec={spec} step={step} still={still} />
    </div>
  );
}

function KindView({
  spec,
  step,
  still,
}: {
  spec: VisualSpec;
  step: number;
  still: boolean;
}) {
  switch (spec.kind) {
    case "zones":
      return <ZonesView spec={spec} step={step} still={still} />;
    case "tiers":
      return <TiersView spec={spec} step={step} still={still} />;
    case "compare":
      return <CompareView spec={spec} step={step} still={still} />;
    case "grid":
      return <GridView spec={spec} step={step} still={still} />;
    case "sequence":
      return <SequenceView spec={spec} step={step} still={still} />;
    case "graph":
      return <GraphView spec={spec} step={step} still={still} />;
  }
}
