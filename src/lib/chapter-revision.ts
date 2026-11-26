import { execFileSync } from "node:child_process";

/**
 * 章の「REV」(表題欄の改訂日)= その章の .md を最後に変えたコミットの日付(YYYY-MM-DD)。
 * ビルド時に git log を 1 回だけ呼び、ファイル → 日付の表を作って使い回す(545 章で 545 回呼ばない)。
 * git がない・浅いクローン(履歴の途中までしかなく日付が嘘になる)・未コミットの章は null(表題欄は「—」)。
 * サーバー(ビルド時)専用。クライアントの部品から import しない。
 */
let table: Map<string, string> | null = null;

function load(): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const shallow = execFileSync(
      "git",
      ["rev-parse", "--is-shallow-repository"],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();
    if (shallow !== "false") return map;
    const out = execFileSync(
      "git",
      ["log", "--format=%x00%cs", "--name-only", "--", "content/foundations"],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        maxBuffer: 32 * 1024 * 1024,
      },
    );
    let date = "";
    for (const line of out.split("\n")) {
      const text = line.trim();
      if (text.startsWith("\u0000")) {
        date = text.slice(1);
      } else if (text.endsWith(".md") && date) {
        const id = text.slice(text.lastIndexOf("/") + 1, -3);
        // 新しいコミットから順に出るので、最初に見た日付が最新
        if (!map.has(id)) map.set(id, date);
      }
    }
  } catch {
    // git がない環境ではすべて null
  }
  return map;
}

export function chapterRevision(id: string): string | null {
  table ??= load();
  return table.get(id) ?? null;
}
