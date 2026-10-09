/**
 * CPU / GPU / NPU の処理の流れを比べるCSSステップアニメーション(ProcessorLanesAnimation)を持つエントリid一覧。
 * React componentへの依存を持たない。
 */
export const ACCELERATOR_ANIMATIONS: Record<string, true> = {
  "cpu-gpu-npu": true,
};
