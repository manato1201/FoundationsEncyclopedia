import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VisualPlayer } from "@/components/visual-frame/VisualPlayer";
import { VisualThumb } from "@/components/visual-frame/VisualThumb";
import { usableVisual, validateVisual } from "@/lib/visual/schema";
import { eyebrowFor } from "@/lib/visual/eyebrow";
import type { OperationStep } from "@/lib/content/foundations";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "図の検証用フィクスチャ",
  robots: { index: false },
};

/**
 * 開発時だけの確認ページ: tests/visual-fixtures/ok-*.md(章ではない検証用の visual)を実際の枠で描く。
 * grid・graph・登場者 4 の sequence・4 列の compare の見た目を、章を作らずに確かめるため。本番では 404。
 */
export default function VisualFixturesPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const dir = path.join(process.cwd(), "tests", "visual-fixtures");
  const fixtures = fs
    .readdirSync(dir)
    .filter((name) => name.startsWith("ok-") && name.endsWith(".md"))
    .sort()
    .map((name) => {
      const { data } = matter(fs.readFileSync(path.join(dir, name), "utf8"));
      const steps = (data.operationSteps ?? []) as OperationStep[];
      return {
        name,
        title: String(data.name),
        eyebrow: eyebrowFor(String(data.category), String(data.subcategory)),
        steps,
        spec: usableVisual(data.visual, steps.length),
        errors: validateVisual(data.visual, steps.length),
      };
    });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>図の検証用フィクスチャ(開発時だけ)</h1>
      {fixtures.map((fixture) => (
        <section
          key={fixture.name}
          id={fixture.name.replace(/\.md$/, "")}
          className={styles.section}
        >
          <h2 className={styles.heading}>
            {fixture.title} <code>{fixture.name}</code>
          </h2>
          {fixture.errors.length > 0 ? (
            <pre className={styles.errors}>{fixture.errors.join("\n")}</pre>
          ) : null}
          <VisualPlayer
            eyebrow={fixture.eyebrow}
            steps={fixture.steps}
            spec={fixture.spec}
          />
          {fixture.spec ? (
            <div className={styles.thumb}>
              <VisualThumb spec={fixture.spec} />
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
