import styles from "./ProvenanceTag.module.css";

/**
 * 値・図の「出どころの札」(P9: 誠実な注記)。語彙は4つに固定する。
 * 測定=実際に計った / 読み取り=資料・データから読んだ / 模擬=形を見せるための概念図 / 推測=確かめていない見立て
 */
export type Provenance = "measured" | "read" | "simulated" | "inferred";

const LABELS: Record<Provenance, string> = {
  measured: "測定",
  read: "読み取り",
  simulated: "模擬",
  inferred: "推測",
};

export function ProvenanceTag({ kind, children }: { kind: Provenance; children?: React.ReactNode }) {
  return (
    <span className={styles.item}>
      <span className={styles.tag} data-kind={kind}>
        {LABELS[kind]}
      </span>
      {children ? <span className={styles.text}>{children}</span> : null}
    </span>
  );
}
