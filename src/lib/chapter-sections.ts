export type ChapterHeading = { id: string; text: string };

export type ChapterSections = {
  /** 解説タブに出す本文(見出しにidを付与済み) */
  explanationHtml: string;
  /** 「実装例」で始まる節。なければ null */
  exampleHtml: string | null;
  /** 解説タブ内のh2見出し(スクロールスパイの目次用) */
  headings: ChapterHeading[];
};

const stripTags = (html: string) => html.replace(/<[^>]*>/g, "").trim();

/**
 * 章本文のHTMLを「解説」と「例」に分け、解説側のh2に目次用のidを付ける。
 * 本文はリポジトリ管理の信頼済みMarkdownをmarkedでHTML化したもので、ここでは節の切り分けとid付与だけを行う。
 */
export function splitChapterBody(bodyHtml: string): ChapterSections {
  const parts = bodyHtml.split(/(?=<h2[\s>])/);
  const explanation: string[] = [];
  const example: string[] = [];
  const headings: ChapterHeading[] = [];

  for (const part of parts) {
    const match = part.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/);
    if (!match) {
      explanation.push(part);
      continue;
    }
    const text = stripTags(match[1]);
    if (text.startsWith("実装例")) {
      example.push(part);
      continue;
    }
    const id = `section-${headings.length + 1}`;
    headings.push({ id, text });
    explanation.push(part.replace(/^<h2[^>]*>/, `<h2 id="${id}">`));
  }

  return {
    explanationHtml: explanation.join(""),
    exampleHtml: example.length > 0 ? example.join("") : null,
    headings,
  };
}
