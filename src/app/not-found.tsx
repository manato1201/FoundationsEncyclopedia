import Link from "next/link";
import { AsciiCrystal } from "@/components/visual/AsciiCrystal";
import { Icon } from "@/components/icons/Icon";
import styles from "./not-found.module.css";

/** 404。鉱石モチーフ(静止画)を置き、カタログへ戻る導線だけを出す。 */
export default function NotFound() {
  return (
    <div className={styles.page}>
      <AsciiCrystal cols={37} rows={19} />
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>このページは見つかりませんでした</h1>
      <p className={styles.subtitle}>
        章の名前が変わったか、アドレスが違う可能性があります。
      </p>
      <Link href="/" className={styles.link}>
        <Icon name="arrow-left" size={14} />
        カタログに戻る
      </Link>
    </div>
  );
}
