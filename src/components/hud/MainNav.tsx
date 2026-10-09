"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AppShell.module.css";

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/basics", label: "基礎学習図鑑とは?" },
  { href: "/", label: "図鑑" },
  { href: "/updates", label: "更新情報" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/foundations/");
  return pathname === href;
}

/** メインナビ。選択中の項目だけをピルで示す(P4)。 */
export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label="メインナビゲーション">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
