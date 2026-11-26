import { MASTERY_BADGE_META, type MasteryBadge } from "@/lib/mastery-badge";
import styles from "./MasteryBadgeChip.module.css";

type MasteryBadgeChipProps = {
  badge: MasteryBadge;
};

/**
 * 習得度バッジの表示コンポーネント(FoundationsEncyclopedia_DESIGN.md Phase 4)。
 * MASTERY_BADGE_META(LEARNING_ROADMAP.mdのバッジ体系そのもの)を参照するだけの薄いラッパーに徹し、
 * 独自の色分岐ロジックは持たない。
 */
export function MasteryBadgeChip({ badge }: MasteryBadgeChipProps) {
  const meta = MASTERY_BADGE_META[badge];
  return (
    <span
      className={styles.badge}
      // バッジの色は枠と左の太線に使う。文字は本文色(紺・白の地のどちらでも 4.5:1 以上を保つため)
      style={{ borderColor: meta.color, boxShadow: `inset 3px 0 0 ${meta.color}` }}
    >
      {meta.emoji} {meta.label}
    </span>
  );
}
