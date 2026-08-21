import { FOR_LOOP_ANIMATIONS } from "./animations/for-loop-animations";
import { GIT_ANIMATIONS } from "./animations/git-animations";
import { DCC_STEP_ANIMATIONS } from "./animations/dcc-step-animations";
import { NETWORK_ANIMATIONS } from "./animations/network-animations";
import { GAME_ENGINE_ANIMATIONS } from "./animations/game-engine-animations";
import { CONTAINER_ANIMATIONS } from "./animations/container-animations";
import { POINTER_ANIMATIONS } from "./animations/pointer-animations";
import { RECURSION_ANIMATIONS } from "./animations/recursion-animations";
import { OWNERSHIP_ANIMATIONS } from "./animations/ownership-animations";
import { ARRAY_ANIMATIONS } from "./animations/array-animations";

/**
 * このidに対応するCSSステップアニメーション(Phase 3の手書きkeyframe型)があるかどうか。
 * React componentへの依存を一切持たないため、ビルド時(getAllMeta)・詳細ページのいずれからでも安全にimportできる。
 * frontmatterに`hasAnimation`を直書きしない、というアンチパターン回避のための一本化(has-visualizer.tsと同型)。
 * operationSteps駆動(Phase 5)のアニメーションはfrontmatterのフィールド有無で直接判定するため、ここには含めない。
 */
export function hasAnimation(id: string): boolean {
  return (
    id in FOR_LOOP_ANIMATIONS ||
    id in GIT_ANIMATIONS ||
    id in DCC_STEP_ANIMATIONS ||
    id in NETWORK_ANIMATIONS ||
    id in GAME_ENGINE_ANIMATIONS ||
    id in CONTAINER_ANIMATIONS ||
    id in POINTER_ANIMATIONS ||
    id in RECURSION_ANIMATIONS ||
    id in OWNERSHIP_ANIMATIONS ||
    id in ARRAY_ANIMATIONS
  );
}
