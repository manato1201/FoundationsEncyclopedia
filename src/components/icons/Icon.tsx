import type { SVGProps } from "react";

/**
 * 線画アイコン1セット(P1: 線の太さ1.75で統一。絵文字・アイコンフォントと混ぜない)。
 * 開閉は下向き(開くと上向き)、遷移は右向き、という使い分けを name で固定する。
 */
const PATHS = {
  /** 遷移(右向き) */
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  /** 戻る(左向き) */
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  /** 下へ誘導 */
  "arrow-down": <path d="M12 5v14M6 13l6 6 6-6" />,
  /** 開閉(閉じている=下向き) */
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  /** 開閉(開いている=上向き) */
  "chevron-up": <path d="M6 15l6-6 6 6" />,
  play: <path d="M8 5l11 7-11 7z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  "step-back": <path d="M15 6l-6 6 6 6" />,
  "step-forward": <path d="M9 6l6 6-6 6" />,
  reset: <path d="M4 12a8 8 0 1 0 3-6.2M4 4v5h5" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
} as const;

export type IconName = keyof typeof PATHS;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 16, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
