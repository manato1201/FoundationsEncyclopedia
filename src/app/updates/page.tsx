import Link from "next/link";
import styles from "./page.module.css";
import { UpdatesFeed } from "@/components/updates/UpdatesFeed";
import { UPDATES } from "@/lib/updates";

/**
 * 更新情報画面。The-Algorithm-Illustratedの/updatesは外部Qiitaフィードを中継表示するが、
 * こちらは図鑑自体の更新履歴(静的データ)を表示する(src/lib/updates.ts参照)。
 */
export default function UpdatesPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backLink}>
        ← カタログに戻る
      </Link>
      <header className={styles.header}>
        <p className={styles.eyebrow}>■ UPDATES 更新情報</p>
        <h1 className={styles.title}>この図鑑の更新履歴</h1>
        <p className={styles.lead}>
          収録エントリの追加・機能追加など、この図鑑自体の更新を記録しています。
        </p>
      </header>
      <UpdatesFeed items={UPDATES} />
    </div>
  );
}
