export type ChapterHeading = { id: string; text: string };

export type ChapterSections = {
  /** 本文に出す節(見出しにidを付与済み)。「実装例」「つまずきやすい点」は除く */
  explanationHtml: string;
  /** 「実装例」で始まる節。なければ null */
  exampleHtml: string | null;
  /** 「つまずきやすい点」で始まる節(詳細画面の NOTES の「使うときの注意」へ回す)。なければ null */
  cautionHtml: string | null;
  /** 本文内のh2見出し(スクロールスパイの目次用) */
  headings: ChapterHeading[];
};

const stripTags = (html: string) => html.replace(/<[^>]*>/g, "").trim();

/**
 * 章本文のHTMLを「本文」「実装例」「つまずきやすい点」に分け、本文側のh2に目次用のidを付ける。
 * 本文はリポジトリ管理の信頼済みMarkdownをmarkedでHTML化したもので、ここでは節の切り分けとid付与だけを行う。
 * 見出しの無い章は、全体が本文になる(実装例・つまずきやすい点は null)。
 */
export function splitChapterBody(bodyHtml: string): ChapterSections {
  const parts = bodyHtml.split(/(?=<h2[\s>])/);
  const explanation: string[] = [];
  const example: string[] = [];
  const caution: string[] = [];
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
    if (text.startsWith("つまずきやすい点")) {
      caution.push(part);
      continue;
    }
    const id = `section-${headings.length + 1}`;
    headings.push({ id, text });
    explanation.push(part.replace(/^<h2[^>]*>/, `<h2 id="${id}">`));
  }

  return {
    explanationHtml: explanation.join(""),
    exampleHtml: example.length > 0 ? example.join("") : null,
    cautionHtml: caution.length > 0 ? caution.join("") : null,
    headings,
  };
}

/** 節の先頭の h2 を外す(パネルの枠の図名が見出しを兼ねるとき) */
export function stripLeadingHeading(sectionHtml: string): string {
  return sectionHtml.replace(/^<h2[^>]*>[\s\S]*?<\/h2>\s*/, "");
}
