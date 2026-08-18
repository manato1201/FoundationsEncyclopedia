import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export interface ContentFrontmatterBase {
  name: string;
  category: string;
  subcategory: string;
  summary: string;
}

export type ContentMeta<T extends ContentFrontmatterBase> = T & {
  id: string;
  /** ビルド時に計算する。可視化コンポーネント本体は読み込まず真偽値のみをクライアントへ渡す。 */
  hasVisualizer: boolean;
};

export type ContentDetail<T extends ContentFrontmatterBase> = ContentMeta<T> & {
  bodyHtml: string;
};

/**
 * The-Algorithm-Illustrated の `src/lib/content/algorithms.ts`(getAllAlgorithmsMeta/getAlgorithmDetail)を
 * ColorEncyclopediaが一般化したコンテンツローダー。FoundationsEncyclopediaはこれを3個目の利用先として
 * そのまま使う(FoundationsEncyclopedia_DESIGN.md Phase 1参照。独自ローダーを新規に書かない)。
 */
export function createContentLoader<T extends ContentFrontmatterBase>(
  contentDirName: string,
  hasVisualizer: (id: string) => boolean,
) {
  const CONTENT_DIR = path.join(process.cwd(), "content", contentDirName);

  function getAllIds(): string[] {
    return fs
      .readdirSync(CONTENT_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""))
      .sort();
  }

  function readFrontmatter(
    id: string,
  ): { frontmatter: T; content: string } | null {
    const filePath = path.join(CONTENT_DIR, `${id}.md`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    return { frontmatter: data as T, content };
  }

  /** カタログ一覧向けの軽量メタデータ。Markdown本文のHTML変換は行わない。 */
  function getAllMeta(): ContentMeta<T>[] {
    return getAllIds()
      .map((id) => {
        const parsed = readFrontmatter(id);
        if (!parsed) return null;
        return { id, ...parsed.frontmatter, hasVisualizer: hasVisualizer(id) };
      })
      .filter((meta): meta is ContentMeta<T> => meta !== null);
  }

  /** 詳細ページ向け。Markdown本文をHTMLへ変換して返す。 */
  function getDetail(id: string): ContentDetail<T> | null {
    const parsed = readFrontmatter(id);
    if (!parsed) return null;
    return {
      id,
      ...parsed.frontmatter,
      hasVisualizer: hasVisualizer(id),
      bodyHtml: marked.parse(parsed.content, { async: false }) as string,
    };
  }

  return { getAllIds, getAllMeta, getDetail };
}
