import type { CSSProperties } from "react";
import type { SequenceSpec } from "@/lib/visual/schema";
import { legendMap, sequenceState } from "@/lib/visual/state";
import styles from "./SequenceView.module.css";

type SequenceViewProps = { spec: SequenceSpec; step: number; still?: boolean };

/**
 * sequence: 登場者を列に並べ(縦の生存線)、メッセージを行として上から積む(シーケンス図)。
 * CSS グリッドで描くので、狭い枠でも文字は折り返して読める(横スクロールしない)。
 * 先の段の行も場所だけ取っておき(透明)、段が進んでも図の高さが変わらない。
 * いまの段のメッセージは色+太線、前の段のものは薄く残す。
 */
export function SequenceView({ spec, step }: SequenceViewProps) {
  const { order, state } = sequenceState(spec, step);
  const legend = legendMap(spec);
  const index = new Map(spec.actors.map((actor, i) => [actor.id, i]));
  const messages = new Map(
    spec.messages.map((message) => [message.id, message]),
  );
  const n = spec.actors.length;

  return (
    <div className={styles.root} data-many={n >= 4 ? "" : undefined} style={{ "--n": n } as CSSProperties}>
      {/* 生存線(背景) */}
      {spec.actors.map((actor, i) => (
        <span
          key={`line-${actor.id}`}
          className={styles.lifeline}
          style={{ gridColumn: i + 1, gridRow: `1 / span ${order.length + 2}` }}
          aria-hidden="true"
        />
      ))}
      {spec.actors.map((actor, i) => {
        const entry = state[actor.id] ? legend.get(state[actor.id]) : undefined;
        return (
          <div
            key={actor.id}
            className={styles.actor}
            style={{ gridColumn: i + 1, gridRow: 1 }}
          >
            <span className={styles.actorBox} title={actor.note}>{actor.label}</span>
            {actor.note ? (
              <span className={styles.actorNote}>{actor.note}</span>
            ) : null}
            <span
              className={styles.actorState}
              data-tone={entry?.tone}
              data-on={entry ? "" : undefined}
            >
              {entry ? `${entry.mark} ${entry.label}` : " "}
            </span>
          </div>
        );
      })}
      {order.map(({ id, step: sentAt }, row) => {
        const message = messages.get(id);
        if (!message) return null;
        const from = index.get(message.from) ?? 0;
        const to = index.get(message.to) ?? 0;
        const self = from === to;
        // 自己メッセージは最大 3 列ぶんの幅を使う(右へ。最後の列なら左へ)
        const selfLeft = self && n > 1 && from === n - 1;
        const span = self ? Math.min(3, selfLeft ? n : n - from) : Math.abs(to - from) + 1;
        const start = self ? (selfLeft ? from - span + 1 : from) : Math.min(from, to);
        const entry = message.key ? legend.get(message.key) : undefined;
        const status =
          sentAt > step ? "future" : sentAt === step ? "current" : "past";
        return (
          <div
            key={id}
            className={styles.message}
            data-status={status}
            data-dir={self ? (selfLeft ? "self-left" : "self") : to > from ? "right" : "left"}
            data-tone={entry?.tone ?? "blue"}
            aria-hidden={status === "future" ? true : undefined}
            style={
              {
                gridColumn: `${start + 1} / span ${span}`,
                gridRow: row + 2,
                "--span": span,
              } as CSSProperties
            }
          >
            <span className={styles.messageLabel}>
              {entry ? (
                <span className={styles.messageMark}>{entry.mark}</span>
              ) : null}
              {message.label}
            </span>
            <span className={styles.arrow} aria-hidden="true">
              <span className={styles.shaft} />
              <span className={styles.head} />
            </span>
            {message.note ? (
              <span className={styles.messageNote}>{message.note}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
