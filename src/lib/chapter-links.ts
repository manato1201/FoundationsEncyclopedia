import fs from "node:fs";
import path from "node:path";
import { foundationsLoader } from "@/lib/content/foundations";

export type LinkedChapter = { id: string; name: string };
export type ChapterLinks = { refers: LinkedChapter[]; referredBy: LinkedChapter[] };

const LINK_PATTERN = /\]\(\/foundations\/([a-z0-9-]+)\)/g;

type Graph = { out: Map<string, Set<string>>; into: Map<string, Set<string>>; names: Map<string, string> };
let cached: Graph | null = null;

/**
 * 章の本文にある `/foundations/<id>` へのリンクから、章どうしのつながりを読み取る(ビルド時)。
 * 「前提」と断定はしない。本文が参照している章 / この章を参照している章、という事実だけを返す(出どころ=読み取り)。
 */
function buildGraph(): Graph {
  const dir = path.join(process.cwd(), "content", "foundations");
  const metas = foundationsLoader.getAllMeta();
  const names = new Map(metas.map((meta) => [meta.id, meta.name]));
  const out = new Map<string, Set<string>>();
  const into = new Map<string, Set<string>>();
  for (const meta of metas) {
    const body = fs.readFileSync(path.join(dir, `${meta.id}.md`), "utf8");
    for (const match of body.matchAll(LINK_PATTERN)) {
      const target = match[1];
      if (target === meta.id || !names.has(target)) continue;
      (out.get(meta.id) ?? out.set(meta.id, new Set()).get(meta.id)!).add(target);
      (into.get(target) ?? into.set(target, new Set()).get(target)!).add(meta.id);
    }
  }
  return { out, into, names };
}

export function getChapterLinks(id: string): ChapterLinks {
  cached ??= buildGraph();
  const toList = (ids: Set<string> | undefined): LinkedChapter[] =>
    [...(ids ?? [])].map((other) => ({ id: other, name: cached!.names.get(other) ?? other }));
  return { refers: toList(cached.out.get(id)), referredBy: toList(cached.into.get(id)) };
}
