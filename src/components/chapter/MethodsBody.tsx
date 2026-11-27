"use client";

import { useRef, useState } from "react";
import styles from "./ChapterDetail.module.css";
import body from "./ChapterBody.module.css";

type MethodsBodyProps = {
  /** 「実装例」の節(見出しを外した HTML。リポジトリ管理の信頼済み Markdown を marked で変換したもの) */
  html: string;
  /** コードの言語(```python の python など)。並びはコードの順 */
  langs: string[];
};

/**
 * METHODS パネルの中身: 言語の札・コピー・実装例の本文。コピーは節の中のコード(pre)を順につないだもの。
 * コードの無い節(文章だけ)ではコピーを出さない。
 */
export function MethodsBody({ html, langs }: MethodsBodyProps) {
  const root = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");

  const copy = async () => {
    const code = Array.from(root.current?.querySelectorAll("pre code") ?? [])
      .map((node) => node.textContent ?? "")
      .join("\n\n")
      .replace(/\n+$/, "");
    if (!code) return;
    let ok = false;
    try {
      await navigator.clipboard.writeText(code);
      ok = true;
    } catch {
      ok = false;
    }
    setStatus(ok ? "コピーしました" : "コピーできませんでした");
    window.setTimeout(() => setStatus(""), 1800);
  };

  return (
    <>
      {langs.length > 0 ? (
        <div className={styles.methodsHead}>
          <ul className={styles.methodsLangs} aria-label="コードの言語">
            {langs.map((lang, index) => (
              <li key={`${lang}-${index}`} className={`${styles.methodsLang} bp-tag`}>
                {lang.toUpperCase()}
              </li>
            ))}
          </ul>
          <span className={styles.copyStatus} role="status">
            {status}
          </span>
          <button type="button" className={styles.copyButton} onClick={copy}>
            コピー
          </button>
        </div>
      ) : null}
      <div ref={root} className={body.markdownBody} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
