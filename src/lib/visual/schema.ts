/**
 * 章の図(frontmatter `visual:`)のデータの形と検証。
 *
 * 6 つの型(kind)の判別共用体。どの型も `steps` を持ち、**段の数・順は章の `operationSteps` と同じ**。
 * 段の状態は「前の段からの差分」で書く(place・state・cells などは前の段の値を引き継ぎ、書いたキーだけ上書きする)。
 * 例外: `focus`・`highlight`・`send` など「いまの段だけ」の指定は引き継がない。
 *
 * このファイルは scripts/verify-visuals.mjs から Node の型除去で直接読む。
 * 型注釈以外の TS 構文(enum・namespace・パラメータプロパティ・import の別名 `@/`)を使わないこと。
 * 書き方のガイド: docs/reference/visual-authoring.md
 */

/** 色の名前(凡例・列・段の色)。実際の色は VisualFrame.module.css の --vz-* がテーマごとに決める */
export type Tone = "blue" | "green" | "amber" | "pink" | "violet" | "cyan" | "gray";
export const TONES: readonly Tone[] = ["blue", "green", "amber", "pink", "violet", "cyan", "gray"];

/** 評価記号: good = ○ 得意 / fair = △ 条件つき / poor = × 苦手 */
export type Mark = "good" | "fair" | "poor";
export const MARKS: readonly Mark[] = ["good", "fair", "poor"];

export interface LegendItem {
  key: string;
  label: string;
  /** 省略時は凡例の並び順で色を割り当てる */
  tone?: Tone;
  /** 箱・チップに添える 1〜2 文字の記号(色だけで区別しないため)。省略時は label の 1 文字目 */
  mark?: string;
}

/** 最後の段で出すまとめ。一言(文字列)か比較表。表のセルは先頭に ○ △ × を置くと評価記号として描く */
export type VisualSummary =
  | string
  | {
      title?: string;
      columns: string[];
      rows: { label: string; cells: string[] }[];
      note?: string;
    };

/** どの型の段にも書ける共通項目 */
export interface StepBase {
  /** 進み具合の帯に出す短い名前(省略時は番号だけ+手順名の省略表示) */
  short?: string;
  /** 段の結論の一言。先頭に ○ △ × を置くと評価記号として描く */
  verdict?: string;
  /** 図の右上の大きな数(「~100倍」など)。数値は広く知られた桁の目安だけ */
  callout?: { value: string; label?: string };
}

interface SpecBase {
  /** 英字の小ラベル。省略時はカテゴリ/サブカテゴリの英字表記 */
  eyebrow?: string;
  /** 図の問いかけ(副題) */
  question: string;
  legend?: LegendItem[];
  summary?: VisualSummary;
  /** true で「数値は目安」を出す。文字列ならその文言で出す */
  approx?: boolean | string;
}

// ---- zones: 名前つきの場所の間を、もの(ファイル・データ・リクエスト)が移動する ----
export interface ZonesStep extends StepBase {
  /** もの id → 場所 id。null でその段から消す。前の段を引き継ぐ */
  place?: Record<string, string | null>;
  /** もの id → 凡例キー。前の段を引き継ぐ */
  state?: Record<string, string>;
  /** いまの段で強調するもの(引き継がない) */
  highlight?: string[];
  /** いまの段で強調する場所(引き継がない) */
  zoneFocus?: string[];
}
export interface ZonesSpec extends SpecBase {
  kind: "zones";
  zones: { id: string; label: string; note?: string }[];
  /** 場所の間に矢印(→)を描くか。既定は true。流れの順がない場所(スタックとヒープなど)は false */
  arrows?: boolean;
  items: { id: string; label: string }[];
  steps: ZonesStep[];
}

// ---- tiers: 階層を上から並べ、各段に数値の棒・補足・段の間の断層 ----
export interface TiersStep extends StepBase {
  /** この段から見せる階層 id(前の段を引き継いで追加)。最初の段で省略すると全部を見せる */
  reveal?: string[];
  /** いまの段で強調する階層(引き継がない) */
  focus?: string[];
  /** この段から見せる断層の id(引き継いで追加) */
  gaps?: string[];
  /** 階層 id → 凡例キー(引き継ぐ)。ヒット/ミスなどの状態 */
  state?: Record<string, string>;
}
export interface TiersSpec extends SpecBase {
  kind: "tiers";
  /** 棒の目盛り。ticks は左から等間隔に並べる目盛りの名前(対数目盛のときは ns・µs・ms・s など) */
  scale: { label: string; ticks?: string[] };
  /** 数値の列の見出し(value・extra) */
  columns?: { value?: string; extra?: string };
  tiers: {
    id: string;
    label: string;
    /** 箱の色(凡例キー)。省略時は並び順の色 */
    key?: string;
    /** 棒の長さ 0〜100(目盛りに合わせて書き手が決める。対数目盛なら桁の位置) */
    bar: number;
    /** 棒の横の数値(「~1ns」) */
    value?: string;
    /** 補足の数値(容量など) */
    extra?: string;
  }[];
  /** 段の間の断層の注記。after の階層の下に出す */
  gaps?: { id: string; after: string; label: string }[];
  steps: TiersStep[];
}

// ---- compare: 2〜4 列の横並びパネル。各パネルに小さなマス+段ごとの評価記号と一言 ----
export type FillOrder = "row" | "all" | "diagonal";
export const FILL_ORDERS: readonly FillOrder[] = ["row", "all", "diagonal"];
export interface CompareCell {
  /** 点灯するマスの数(0〜units.count) */
  lit?: number;
  /** 点灯の順(row = 1 つずつ順に / all = 一斉に / diagonal = 斜めの波)。動きを減らす設定では最終状態だけ */
  order?: FillOrder;
  mark?: Mark;
  text?: string;
  /** 小さな補足(「~100ns」など) */
  note?: string;
}
export interface CompareStep extends StepBase {
  /** 列 id → その段のパネルの状態(引き継がない。書かない列は空の状態) */
  cells?: Record<string, CompareCell>;
}
export interface CompareSpec extends SpecBase {
  kind: "compare";
  columns: {
    id: string;
    label: string;
    /** パネル右上の英字の札(「CACHE」など) */
    tag?: string;
    tone?: Tone;
    /** パネルの小さな図(マス)の数と列数 */
    units: { count: number; cols?: number; label?: string };
  }[];
  steps: CompareStep[];
}

// ---- grid: マス(行列・表・バケット)が段ごとに埋まる/光る/走査される ----
export interface GridStep extends StepBase {
  /** "行,列"(0 始まり)→ 凡例キー。前の段を引き継ぐ */
  cells?: Record<string, string>;
  /** "行,列" → マスの文字。前の段を引き継ぐ */
  values?: Record<string, string>;
  /** いまの段で枠を付けるマス(引き継がない) */
  focus?: string[];
  /** true でこの段の前に cells・values を空に戻す */
  clear?: boolean;
}
export interface GridSpec extends SpecBase {
  kind: "grid";
  rows: string[];
  cols: string[];
  rowLabel?: string;
  colLabel?: string;
  /** 最初からマスに入っている文字(rows × cols) */
  initial?: string[][];
  steps: GridStep[];
}

// ---- sequence: 縦の登場者の列の間をメッセージが行き来する ----
export interface SequenceStep extends StepBase {
  /** この段で送るメッセージ id(前の段までのものは薄く残る) */
  send?: string[];
  /** 登場者 id → 凡例キー(引き継ぐ。「共通鍵を持つ」など) */
  state?: Record<string, string>;
}
export interface SequenceSpec extends SpecBase {
  kind: "sequence";
  actors: { id: string; label: string; note?: string }[];
  /** from と to が同じなら、その登場者の中での処理(自己メッセージ) */
  messages: { id: string; from: string; to: string; label: string; note?: string; key?: string }[];
  steps: SequenceStep[];
}

// ---- graph: ノードとエッジ。段ごとに訪問・経路・強調が進む ----
export interface GraphStep extends StepBase {
  /** ノード id → 凡例キー(引き継ぐ) */
  nodes?: Record<string, string>;
  /** エッジ id → 凡例キー(引き継ぐ)。エッジ id の既定は "from>to" */
  edges?: Record<string, string>;
  /** ノード id → ノードの下の小さな文字(距離など。引き継ぐ) */
  notes?: Record<string, string>;
  /** いまの段で強調するノード(引き継がない) */
  focus?: string[];
}
export interface GraphSpec extends SpecBase {
  kind: "graph";
  directed?: boolean;
  /** x・y は 0〜100(左上が 0) */
  /** hidden: true は、状態(steps の nodes)が付く段まで隠す(まだ無いコミット・まだ作っていないものなど) */
  nodes: { id: string; label: string; x: number; y: number; hidden?: boolean }[];
  /** hidden: true は、状態(steps の edges)が付く段まで隠す。隠れたノードにつながるエッジも隠れる */
  edges: { id?: string; from: string; to: string; label?: string; hidden?: boolean }[];
  steps: GraphStep[];
}

export type VisualSpec = ZonesSpec | TiersSpec | CompareSpec | GridSpec | SequenceSpec | GraphSpec;
export type VisualKind = VisualSpec["kind"];
export const VISUAL_KINDS: readonly VisualKind[] = ["zones", "tiers", "compare", "grid", "sequence", "graph"];

/** エッジの id(省略時は "from>to") */
export function edgeId(edge: { id?: string; from: string; to: string }): string {
  return edge.id ?? `${edge.from}>${edge.to}`;
}

/** "○ 得意" → { mark: "good", text: "得意" }。記号がなければ mark は undefined */
export function splitMark(text: string): { mark?: Mark; text: string } {
  const trimmed = text.trimStart();
  const head = trimmed.charAt(0);
  const mark: Mark | undefined = head === "○" || head === "◎" ? "good" : head === "△" ? "fair" : head === "×" || head === "✕" ? "poor" : undefined;
  return mark ? { mark, text: trimmed.slice(1).trimStart() } : { text };
}

// ------------------------------------------------------------------
// 検証
// ------------------------------------------------------------------

type Obj = Record<string, unknown>;

function isObj(value: unknown): value is Obj {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStr(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
function isNum(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** id の一覧を読み、重複・空を報告する */
function collectIds(list: unknown, where: string, errors: string[]): Set<string> {
  const ids = new Set<string>();
  if (!Array.isArray(list) || list.length === 0) {
    errors.push(`${where} が空か配列でない`);
    return ids;
  }
  list.forEach((item, index) => {
    if (!isObj(item) || !isStr(item.id)) {
      errors.push(`${where}[${index}] に id がない`);
      return;
    }
    if (!isStr(item.label)) errors.push(`${where}[${index}](${item.id}) に label がない`);
    if (ids.has(item.id)) errors.push(`${where} の id「${item.id}」が重複している`);
    ids.add(item.id);
  });
  return ids;
}

function checkRef(id: unknown, ids: Set<string>, what: string, where: string, errors: string[]) {
  if (!isStr(id) || !ids.has(id)) errors.push(`${where}: 未定義の ${what}「${String(id)}」`);
}

function checkRefList(list: unknown, ids: Set<string>, what: string, where: string, errors: string[]) {
  if (list === undefined) return;
  if (!Array.isArray(list)) {
    errors.push(`${where} は配列で書く`);
    return;
  }
  for (const id of list) checkRef(id, ids, what, where, errors);
}

function checkRecord(
  record: unknown,
  keyIds: Set<string> | null,
  keyWhat: string,
  where: string,
  errors: string[],
  value: (value: unknown, key: string) => void,
) {
  if (record === undefined) return;
  if (!isObj(record)) {
    errors.push(`${where} は「キー: 値」の形で書く`);
    return;
  }
  for (const [key, val] of Object.entries(record)) {
    if (keyIds && !keyIds.has(key)) errors.push(`${where}: 未定義の ${keyWhat}「${key}」`);
    value(val, key);
  }
}

function legendKeyChecker(legend: Set<string>, where: string, errors: string[]) {
  return (value: unknown) => {
    if (!isStr(value) || !legend.has(value)) errors.push(`${where}: 凡例にないキー「${String(value)}」`);
  };
}

function checkStepBase(step: Obj, where: string, errors: string[]) {
  if (step.short !== undefined && !isStr(step.short)) errors.push(`${where}.short は文字列で書く`);
  if (step.verdict !== undefined && !isStr(step.verdict)) errors.push(`${where}.verdict は文字列で書く`);
  if (step.callout !== undefined && (!isObj(step.callout) || !isStr(step.callout.value))) {
    errors.push(`${where}.callout には value(文字列)が要る`);
  }
}

function checkSummary(summary: unknown, errors: string[]) {
  if (summary === undefined || isStr(summary)) return;
  if (!isObj(summary) || !Array.isArray(summary.columns) || !Array.isArray(summary.rows)) {
    errors.push("summary は文字列か { columns, rows } で書く");
    return;
  }
  const width = summary.columns.length;
  summary.rows.forEach((row, index) => {
    if (!isObj(row) || !isStr(row.label) || !Array.isArray(row.cells)) {
      errors.push(`summary.rows[${index}] に label と cells が要る`);
    } else if (row.cells.length !== width) {
      errors.push(`summary.rows[${index}] のセルの数(${row.cells.length})が columns の数(${width})と違う`);
    }
  });
}

/** "r,c" が rows × cols の範囲内か */
function checkCellAddress(address: string, rows: number, cols: number, where: string, errors: string[]) {
  const match = /^(\d+),(\d+)$/.exec(address);
  if (!match) {
    errors.push(`${where}: マスの番地「${address}」は "行,列"(0 始まりの数)で書く`);
    return;
  }
  const r = Number(match[1]);
  const c = Number(match[2]);
  if (r >= rows || c >= cols) errors.push(`${where}: マス「${address}」が表の範囲(${rows} 行 × ${cols} 列)の外`);
}

/**
 * `visual` を検証し、問題の一覧(日本語)を返す。空配列なら描画してよい。
 * stepCount は章の operationSteps の数(段の数はこれと同じでなければならない)。
 * 画面側は、エラーがあれば図を出さず手順トラックへフォールバックする。
 */
export function validateVisual(spec: unknown, stepCount: number): string[] {
  const errors: string[] = [];
  if (!isObj(spec)) return ["visual が「キー: 値」の形でない"];
  const kind = spec.kind;
  if (!isStr(kind) || !(VISUAL_KINDS as readonly string[]).includes(kind)) {
    return [`kind「${String(kind)}」は ${VISUAL_KINDS.join(" / ")} のどれかにする`];
  }
  if (!isStr(spec.question)) errors.push("question(図の問いかけ)がない");
  if (spec.eyebrow !== undefined && !isStr(spec.eyebrow)) errors.push("eyebrow は文字列で書く");
  if (spec.approx !== undefined && typeof spec.approx !== "boolean" && !isStr(spec.approx)) {
    errors.push("approx は true か文字列で書く");
  }
  checkSummary(spec.summary, errors);

  // 凡例
  const legend = new Set<string>();
  if (spec.legend !== undefined) {
    if (!Array.isArray(spec.legend)) errors.push("legend は配列で書く");
    else
      spec.legend.forEach((item, index) => {
        if (!isObj(item) || !isStr(item.key) || !isStr(item.label)) {
          errors.push(`legend[${index}] に key と label が要る`);
          return;
        }
        if (legend.has(item.key)) errors.push(`legend のキー「${item.key}」が重複している`);
        if (item.tone !== undefined && !(TONES as readonly unknown[]).includes(item.tone)) {
          errors.push(`legend[${index}] の tone「${String(item.tone)}」は ${TONES.join(" / ")} のどれか`);
        }
        legend.add(item.key);
      });
  }

  // 段の数
  const steps = spec.steps;
  if (!Array.isArray(steps) || steps.length === 0) {
    errors.push("steps が空か配列でない");
    return errors;
  }
  if (steps.length !== stepCount) {
    errors.push(`steps の数(${steps.length})が operationSteps の数(${stepCount})と違う`);
  }
  const stepObjs: Obj[] = [];
  steps.forEach((step, index) => {
    if (!isObj(step)) errors.push(`steps[${index}] が「キー: 値」の形でない`);
    else {
      checkStepBase(step, `steps[${index}]`, errors);
      stepObjs.push(step);
    }
  });
  if (stepObjs.length !== steps.length) return errors;

  switch (kind) {
    case "zones":
      validateZones(spec, stepObjs, legend, errors);
      break;
    case "tiers":
      validateTiers(spec, stepObjs, legend, errors);
      break;
    case "compare":
      validateCompare(spec, stepObjs, errors);
      break;
    case "grid":
      validateGrid(spec, stepObjs, legend, errors);
      break;
    case "sequence":
      validateSequence(spec, stepObjs, legend, errors);
      break;
    case "graph":
      validateGraph(spec, stepObjs, legend, errors);
      break;
  }
  return errors;
}

function validateZones(spec: Obj, steps: Obj[], legend: Set<string>, errors: string[]) {
  const zones = collectIds(spec.zones, "zones", errors);
  if (spec.arrows !== undefined && typeof spec.arrows !== "boolean") errors.push("arrows は true か false で書く");
  const items = collectIds(spec.items, "items", errors);
  steps.forEach((step, index) => {
    const where = `steps[${index}]`;
    checkRecord(step.place, items, "item", `${where}.place`, errors, (value) => {
      if (value !== null) checkRef(value, zones, "zone", `${where}.place`, errors);
    });
    checkRecord(step.state, items, "item", `${where}.state`, errors, legendKeyChecker(legend, `${where}.state`, errors));
    checkRefList(step.highlight, items, "item", `${where}.highlight`, errors);
    checkRefList(step.zoneFocus, zones, "zone", `${where}.zoneFocus`, errors);
  });
  // 最初の段で、どのものも場所が決まっていないと何も描けない
  const first = steps[0]?.place;
  if (!isObj(first) || Object.keys(first).length === 0) errors.push("steps[0].place で、最初に置くものの場所を決める");
}

function validateTiers(spec: Obj, steps: Obj[], legend: Set<string>, errors: string[]) {
  if (!isObj(spec.scale) || !isStr(spec.scale.label)) errors.push("scale.label(棒の目盛りの名前)がない");
  const tiers = collectIds(spec.tiers, "tiers", errors);
  if (Array.isArray(spec.tiers)) {
    spec.tiers.forEach((tier, index) => {
      if (!isObj(tier)) return;
      if (!isNum(tier.bar) || tier.bar < 0 || tier.bar > 100) errors.push(`tiers[${index}].bar は 0〜100 の数`);
      if (tier.key !== undefined && (!isStr(tier.key) || !legend.has(tier.key))) {
        errors.push(`tiers[${index}].key: 凡例にないキー「${String(tier.key)}」`);
      }
    });
  }
  const gaps = new Set<string>();
  if (spec.gaps !== undefined) {
    if (!Array.isArray(spec.gaps)) errors.push("gaps は配列で書く");
    else
      spec.gaps.forEach((gap, index) => {
        if (!isObj(gap) || !isStr(gap.id) || !isStr(gap.label)) {
          errors.push(`gaps[${index}] に id と label が要る`);
          return;
        }
        checkRef(gap.after, tiers, "tier", `gaps[${index}].after`, errors);
        gaps.add(gap.id);
      });
  }
  steps.forEach((step, index) => {
    const where = `steps[${index}]`;
    checkRefList(step.reveal, tiers, "tier", `${where}.reveal`, errors);
    checkRefList(step.focus, tiers, "tier", `${where}.focus`, errors);
    checkRefList(step.gaps, gaps, "gap", `${where}.gaps`, errors);
    checkRecord(step.state, tiers, "tier", `${where}.state`, errors, legendKeyChecker(legend, `${where}.state`, errors));
  });
}

function validateCompare(spec: Obj, steps: Obj[], errors: string[]) {
  const columns = collectIds(spec.columns, "columns", errors);
  const counts = new Map<string, number>();
  if (Array.isArray(spec.columns)) {
    if (spec.columns.length < 2 || spec.columns.length > 4) errors.push(`columns は 2〜4 列(いま ${spec.columns.length} 列)`);
    spec.columns.forEach((column, index) => {
      if (!isObj(column)) return;
      if (column.tone !== undefined && !(TONES as readonly unknown[]).includes(column.tone)) {
        errors.push(`columns[${index}].tone「${String(column.tone)}」は ${TONES.join(" / ")} のどれか`);
      }
      const units = column.units;
      if (!isObj(units) || !isNum(units.count) || units.count < 1 || units.count > 64) {
        errors.push(`columns[${index}].units.count は 1〜64 の数`);
        return;
      }
      if (units.cols !== undefined && (!isNum(units.cols) || units.cols < 1)) errors.push(`columns[${index}].units.cols は 1 以上の数`);
      if (isStr(column.id)) counts.set(column.id, units.count);
    });
  }
  steps.forEach((step, index) => {
    const where = `steps[${index}].cells`;
    checkRecord(step.cells, columns, "column", where, errors, (cell, key) => {
      if (!isObj(cell)) {
        errors.push(`${where}.${key} は「キー: 値」の形で書く`);
        return;
      }
      const max = counts.get(key) ?? 0;
      if (cell.lit !== undefined && (!isNum(cell.lit) || cell.lit < 0 || cell.lit > max)) {
        errors.push(`${where}.${key}.lit は 0〜${max}(units.count)の数`);
      }
      if (cell.order !== undefined && !(FILL_ORDERS as readonly unknown[]).includes(cell.order)) {
        errors.push(`${where}.${key}.order は ${FILL_ORDERS.join(" / ")} のどれか`);
      }
      if (cell.mark !== undefined && !(MARKS as readonly unknown[]).includes(cell.mark)) {
        errors.push(`${where}.${key}.mark は ${MARKS.join(" / ")} のどれか`);
      }
    });
  });
}

function validateGrid(spec: Obj, steps: Obj[], legend: Set<string>, errors: string[]) {
  const rows = Array.isArray(spec.rows) ? spec.rows.length : 0;
  const cols = Array.isArray(spec.cols) ? spec.cols.length : 0;
  if (rows === 0) errors.push("rows(行の見出し)が空");
  if (cols === 0) errors.push("cols(列の見出し)が空");
  if (rows > 16 || cols > 16) errors.push("grid は 16 行 × 16 列まで");
  if (spec.initial !== undefined) {
    if (!Array.isArray(spec.initial) || spec.initial.length !== rows || spec.initial.some((row) => !Array.isArray(row) || row.length !== cols)) {
      errors.push(`initial は ${rows} 行 × ${cols} 列の配列で書く`);
    }
  }
  steps.forEach((step, index) => {
    const where = `steps[${index}]`;
    const key = legendKeyChecker(legend, `${where}.cells`, errors);
    checkRecord(step.cells, null, "", `${where}.cells`, errors, (value, address) => {
      checkCellAddress(address, rows, cols, `${where}.cells`, errors);
      key(value);
    });
    checkRecord(step.values, null, "", `${where}.values`, errors, (_value, address) => {
      checkCellAddress(address, rows, cols, `${where}.values`, errors);
    });
    if (step.focus !== undefined) {
      if (!Array.isArray(step.focus)) errors.push(`${where}.focus は配列で書く`);
      else for (const address of step.focus) checkCellAddress(String(address), rows, cols, `${where}.focus`, errors);
    }
  });
}

function validateSequence(spec: Obj, steps: Obj[], legend: Set<string>, errors: string[]) {
  const actors = collectIds(spec.actors, "actors", errors);
  if (Array.isArray(spec.actors) && spec.actors.length > 5) errors.push("actors は 5 人まで");
  const messages = collectIds(spec.messages, "messages", errors);
  if (Array.isArray(spec.messages)) {
    spec.messages.forEach((message, index) => {
      if (!isObj(message)) return;
      checkRef(message.from, actors, "actor", `messages[${index}].from`, errors);
      checkRef(message.to, actors, "actor", `messages[${index}].to`, errors);
      if (message.key !== undefined && (!isStr(message.key) || !legend.has(message.key))) {
        errors.push(`messages[${index}].key: 凡例にないキー「${String(message.key)}」`);
      }
    });
  }
  const sent = new Set<string>();
  steps.forEach((step, index) => {
    const where = `steps[${index}]`;
    checkRefList(step.send, messages, "message", `${where}.send`, errors);
    if (Array.isArray(step.send)) {
      for (const id of step.send) {
        if (sent.has(String(id))) errors.push(`${where}.send: メッセージ「${String(id)}」を 2 回送っている`);
        sent.add(String(id));
      }
    }
    checkRecord(step.state, actors, "actor", `${where}.state`, errors, legendKeyChecker(legend, `${where}.state`, errors));
  });
}

function validateGraph(spec: Obj, steps: Obj[], legend: Set<string>, errors: string[]) {
  const nodes = collectIds(spec.nodes, "nodes", errors);
  if (Array.isArray(spec.nodes)) {
    spec.nodes.forEach((node, index) => {
      if (!isObj(node)) return;
      if (!isNum(node.x) || node.x < 0 || node.x > 100 || !isNum(node.y) || node.y < 0 || node.y > 100) {
        errors.push(`nodes[${index}] の x・y は 0〜100 の数`);
      }
      if (node.hidden !== undefined && typeof node.hidden !== "boolean") errors.push(`nodes[${index}].hidden は true か false`);
    });
  }
  const edges = new Set<string>();
  if (!Array.isArray(spec.edges)) errors.push("edges が配列でない");
  else
    spec.edges.forEach((edge, index) => {
      if (!isObj(edge)) {
        errors.push(`edges[${index}] が「キー: 値」の形でない`);
        return;
      }
      checkRef(edge.from, nodes, "node", `edges[${index}].from`, errors);
      checkRef(edge.to, nodes, "node", `edges[${index}].to`, errors);
      if (edge.hidden !== undefined && typeof edge.hidden !== "boolean") errors.push(`edges[${index}].hidden は true か false`);
      const id = edgeId(edge as { id?: string; from: string; to: string });
      if (edges.has(id)) errors.push(`edges の id「${id}」が重複している`);
      edges.add(id);
    });
  steps.forEach((step, index) => {
    const where = `steps[${index}]`;
    checkRecord(step.nodes, nodes, "node", `${where}.nodes`, errors, legendKeyChecker(legend, `${where}.nodes`, errors));
    checkRecord(step.edges, edges, "edge", `${where}.edges`, errors, legendKeyChecker(legend, `${where}.edges`, errors));
    checkRecord(step.notes, nodes, "node", `${where}.notes`, errors, () => {});
    checkRefList(step.focus, nodes, "node", `${where}.focus`, errors);
  });
}

/** 検証を通った spec だけを返す(画面側のフォールバック判定) */
export function usableVisual(spec: unknown, stepCount: number): VisualSpec | undefined {
  if (spec === undefined || spec === null) return undefined;
  return validateVisual(spec, stepCount).length === 0 ? (spec as VisualSpec) : undefined;
}
