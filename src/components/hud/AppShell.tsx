import Link from "next/link";
import { CornerBrackets } from "./CornerBrackets";
import { StatusChip } from "./StatusChip";
import { LiveClock } from "./LiveClock";
import styles from "./AppShell.module.css";

type AppShellProps = {
  children: React.ReactNode;
};

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/", label: "図鑑" },
];

/**
 * 全画面共通のHUDフレーム(The-Algorithm-Illustrated/ColorEncyclopediaのAppShellを踏襲)。
 * ヘッダー(ブランド+ナビゲーション+ステータスチップ+ライブ時計)を提供する。
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.frame}>
      <CornerBrackets />
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandDot} aria-hidden="true" />
          <Link href="/" className={styles.brandName}>
            FOUNDATIONS ENCYCLOPEDIA
          </Link>
          <span className={styles.brandSub}>基礎学習図鑑 — プログラミング/IT/DCC/ツール/フレームワークの土台知識</span>
        </div>
        <nav className={styles.nav} aria-label="メインナビゲーション">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.headerRight}>
          <StatusChip status="online" />
          <LiveClock />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
