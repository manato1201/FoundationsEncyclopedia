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
      style={{ borderColor: meta.color, color: meta.color }}
    >
      {meta.emoji} {meta.label}
    </span>
  );
}
