import { Fragment, type CSSProperties } from "react";
import type { TiersSpec } from "@/lib/visual/schema";
import { legendMap, tiersState, toneAt } from "@/lib/visual/state";
import styles from "./TiersView.module.css";

type TiersViewProps = { spec: TiersSpec; step: number; still?: boolean };

/**
 * tiers: 階層を上から並べる。左 = 幅が下へ広がる箱(ピラミッド)、右 = 数値・目盛りつきの棒・補足の数値。
 * まだ出していない階層も場所は取っておき(透明)、段が進んでもレイアウトが動かないようにする。
 * 棒は transform: scaleX で伸びる。
 */
export function TiersView({ spec, step }: TiersViewProps) {
  const { revealed, gaps, state, focus } = tiersState(spec, step);
  const legend = legendMap(spec);
  const count = spec.tiers.length;
  const hasFocus = focus.size > 0;
  const ticks = spec.scale.ticks ?? [];

  return (
    <div className={styles.root} role="table" aria-label={spec.scale.label}>
      <div className={styles.head} role="row">
        <span className={styles.headTier} role="columnheader">
          TIER
        </span>
        <span className={styles.headValue} role="columnheader">
          {spec.columns?.value ?? ""}
        </span>
        <span className={styles.headBar} role="columnheader">
          <span className={styles.scaleLabel}>{spec.scale.label}</span>
          {ticks.length > 0 ? (
            <span className={styles.ticks} aria-hidden="true">
              {ticks.map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </span>
          ) : null}
        </span>
        <span className={styles.headExtra} role="columnheader">
          {spec.columns?.extra ?? ""}
        </span>
      </div>
      {spec.tiers.map((tier, index) => {
        const shown = revealed.has(tier.id);
        const keyEntry = tier.key ? legend.get(tier.key) : undefined;
        const tone = keyEntry?.tone ?? toneAt(index);
        const stateEntry = state[tier.id]
          ? legend.get(state[tier.id])
          : undefined;
        const gap = spec.gaps?.find((g) => g.after === tier.id);
        // 箱の幅: 上(速い・小さい)ほど細く、下ほど広い
        const width = count > 1 ? 42 + (58 * index) / (count - 1) : 100;
        return (
          <Fragment key={tier.id}>
            <div
              className={styles.row}
              role="row"
              data-shown={shown ? "" : undefined}
              data-focus={focus.has(tier.id) ? "" : undefined}
              data-dim={hasFocus && !focus.has(tier.id) ? "" : undefined}
              data-tone={tone}
              aria-hidden={shown ? undefined : true}
            >
              <span className={styles.tierCell} role="cell">
                <span className={styles.pointer} aria-hidden="true">
                  ▶
                </span>
                <span
                  className={styles.box}
                  style={{ "--w": `${width}%` } as CSSProperties}
                >
                  {tier.label}
                </span>
                {stateEntry ? (
                  <span className={styles.state} data-tone={stateEntry.tone}>
                    {stateEntry.mark} {stateEntry.label}
                  </span>
                ) : null}
              </span>
              <span className={styles.value} role="cell">
                <BreakAfterTilde text={tier.value ?? ""} />
              </span>
              <span className={styles.barCell} role="cell" aria-hidden="true">
                <span className={styles.track}>
                  <span
                    className={styles.bar}
                    style={{ "--b": tier.bar / 100 } as CSSProperties}
                  />
                </span>
              </span>
              <span className={styles.extra} role="cell">
                <BreakAfterTilde text={tier.extra ?? ""} />
              </span>
            </div>
            {gap ? (
              <div
                className={styles.gap}
                role="row"
                data-shown={gaps.has(gap.id) ? "" : undefined}
              >
                <span role="cell">▼ {gap.label}</span>
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}

/** 「数十ms〜数秒」の 〜 の後ろに折り返しの候補(<wbr>)を入れる */
function BreakAfterTilde({ text }: { text: string }) {
  const parts = text.split("〜");
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 ? (
            <>
              〜<wbr />
            </>
          ) : null}
        </Fragment>
      ))}
    </>
  );
}
