import type { GlyphName } from "@/components/scene/glyphs";
import type { OperationStep } from "@/lib/content/foundations";

/**
 * 手順(operationSteps)を図にするときの「型」を決める純粋関数群。Reactにも three にも依存しないので、
 * ビルド時にも詳細ページ側でも安全に import できる。
 *
 * - 平面(2D): pipeline(蛇行する流れ) / cycle(輪)
 * - 立体(3D): stack(層の分解) / helix(らせんの道) / ring(輪) / tree(階層) / color(RGB立方体) / mesh(形が育つ)
 *   立体は「形・色・層」が主題の章に向く。向かない章は平面を既定にし、立体は切り替えで見られる。
 */
export type FlowKind = "pipeline" | "cycle";
export type SolidKind = "stack" | "helix" | "ring" | "tree" | "color" | "mesh";

export interface SceneSpec {
  flow: FlowKind;
  solid: SolidKind;
  /** 立体を既定にするか(主題が立体向きのとき true) */
  solidFirst: boolean;
}

/** 立体が主題に合う章(色・形・層・階層・輪)を id から決める。上から順に最初に当たったものを採る */
const SOLID_RULES: { kind: SolidKind; pattern: RegExp }[] = [
  {
    kind: "color",
    pattern:
      /(color|hdr|tone-?map|gamma|exposure|post-process|bloom|pbr|material|hypershade|shading|texture|alpha-blending|decals?|karma|arnold|render-layers|lumen|shader-graph|urp-hdrp|vfx-graph|particle|niagara|lighting|light-types|shader)/,
  },
  {
    kind: "tree",
    pattern:
      /(tree|hierarchy|dom-basics|scene-graph|outliner|inheritance|oop|namespace|sealed|traits|k8s|orchestration|dns|cdn|load-balanc|reverse-proxy|api-gateway|message-queue|sharding|replication|node-network|node-editor|geometry-nodes|vop|lops|pdg|blueprint|graph-bfs|dijkstra|trie|heap|merge-switch|reference-editor|prefab|actor-component|game-framework|app-router|zero-trust|microservice)/,
  },
  {
    kind: "ring",
    pattern:
      /(loop|cycle|agile|(^|-)ci-|cd-vs|devops|game-loop|event-loop|retry|polling|feedback|iteration|scrum|lifecycle|postmortem|refactoring|code-review|pull-request|observability|auto-scaling|scheduling|coroutine|generators|state-machine|branch-workflow|branching|rate-limit|for-each|cron|timers|input-buffering|delta-time)/,
  },
  {
    kind: "stack",
    pattern:
      /(layer|osi|stack|isolation|container-vs-vm|virtual-memory|cpu-memory|memory|file-system|boot-process|kernel|cache|garbage|recursion|middleware|tcp|tls|https|dockerfile|asset-pipeline|ownership|borrow|endianness|bit-vs|execution-environment|modifier|container-image|docker|nat-basics|vpn|firewall|encapsulation|virtualization|hypervisor|serverless|iac|cloud-service|network-basics|ip-subnet|dhcp)/,
  },
  {
    kind: "mesh",
    pattern:
      /(mesh|model|uv|normal|subdiv|topology|loop-cut|extrude|bevel|inset|multi-cut|sculpt|vertex|edge-loops|poly|boolean|curves|sweep|copy-to-points|scatter|transform|pivot|freeze|mirror|soft-selection|lod|frustum|culling|vdb|vellum|rbd|physics|collision|collider|rigidbody|raycast|line-trace|navmesh|terrain|landscape|tilemap|camera|cinemachine|baking|bake|deformer|blend-shapes|shape-keys|skin|rig|ik-fk|constraints|motion-path|spline|nanite|sprite|draw-calls|batching|world-partition|level-streaming|skeletal|pointers?|arrays?|flip-fluid|pyro|crowds|kinefx|playblast|playback|control-rig|timeline|sequencer|animation|keyframe|graph-editor)/,
  },
];

/** 手順の流れが主題で、平面の方が読みやすい章を明示する(上の規則より優先) */
const FLAT_FIRST =
  /(commands?|grep|sed-awk|git-|npm|package-manager|gitignore|env|python-|php-|ruby-|lua-|java-|csharp-|go-|rust-|kotlin-|cpp-|javascript-)/;

/** 個別の上書き。規則で外れる章だけをここに足す */
const OVERRIDES: Record<string, Partial<SceneSpec>> = {
  "git-branch-workflow": { solid: "tree", flow: "pipeline", solidFirst: false },
  "binary-search-basics": { solid: "tree", solidFirst: false },
  "binary-tree-basics": { solid: "tree", solidFirst: true },
  "big-o-basics": { solid: "helix", solidFirst: false },
  "docker-basics": { solid: "stack", solidFirst: false },
  "docker-compose-basics": { solid: "tree", solidFirst: false },
  "cpu-gpu-npu": { solid: "stack", solidFirst: false },
};

const CYCLE_FLOW =
  /(loop|cycle|agile|(^|-)ci-|devops|event-loop|retry|polling|feedback|iteration|scrum|lifecycle|postmortem|refactoring|observability|scheduling|game-loop|state-machine|cron|auto-scaling)/;

export function resolveScene(id: string): SceneSpec {
  let solid: SolidKind = "helix";
  let matched = false;
  for (const rule of SOLID_RULES) {
    if (rule.pattern.test(id)) {
      solid = rule.kind;
      matched = true;
      break;
    }
  }
  // 言語の文法チュートリアル(python-... など)は流れの図が主。cycle 系の語を含むものだけ輪を使う
  const flat = FLAT_FIRST.test(id) && !(solid === "ring" && matched);
  const spec: SceneSpec = {
    flow: CYCLE_FLOW.test(id) ? "cycle" : "pipeline",
    solid,
    solidFirst: matched && !flat,
  };
  return { ...spec, ...OVERRIDES[id] };
}

/** 各ステップに当てる線画グリフの規則。ラベルを先に、それで決まらなければ補足文まで含めて探す */
const GLYPH_RULES: { glyph: GlyphName; pattern: RegExp }[] = [
  { glyph: "trash", pattern: /削除|破棄|消す|rm\b|delete|drop\b|prune/i },
  { glyph: "stop", pattern: /停止|止め|終了させ|stop|kill|shutdown|中断/i },
  {
    glyph: "bug",
    pattern: /バグ|エラー|例外|失敗|デバッグ|debug|exception|error|不具合/i,
  },
  {
    glyph: "test",
    pattern: /テスト|検証|assert|テストを|チェック|lint|verify|アサート/i,
  },
  {
    glyph: "branch",
    pattern:
      /コミット|commit|ブランチ|branch|merge|マージ|rebase|リベース|cherry|分岐|統合/i,
  },
  {
    glyph: "upload",
    pattern:
      /push|プッシュ|アップロード|upload|公開|deploy|デプロイ|配信|リリース|publish|出力先|書き出|export|エクスポート|ビルドして出/i,
  },
  {
    glyph: "download",
    pattern:
      /pull\b|プル|ダウンロード|download|clone|クローン|fetch|取得|install|インストール|import|インポート|読み込/i,
  },
  {
    glyph: "gear",
    pattern:
      /ビルド|build|compile|コンパイル|bake|ベイク|生成|generate|設定|構成|config|オプション|パラメータ|parameter|プロパティ|property|有効|enable|セットアップ|初期化|init/i,
  },
  {
    glyph: "play",
    pattern: /実行|run\b|起動|start|開始|再生|play|launch|走ら|呼び出/i,
  },
  {
    glyph: "key",
    pattern:
      /認証|ログイン|auth|token|トークン|鍵|key\b|暗号|secret|パスワード|署名|sign/i,
  },
  {
    glyph: "shield",
    pattern:
      /権限|セキュリティ|防|保護|firewall|許可|制限|分離|隔離|サンドボックス|sandbox/i,
  },
  { glyph: "lock", pattern: /ロック|lock|排他|mutex|固定/i },
  {
    glyph: "globe",
    pattern:
      /http|url|dns|ブラウザ|web|サイト|ページ|リクエスト|request|レスポンス|response|ドメイン/i,
  },
  {
    glyph: "network",
    pattern:
      /ネットワーク|通信|接続|サーバ|server|ポート|ip\b|api|エンドポイント|ルーティング|routing|proxy|プロキシ|ノード/i,
  },
  {
    glyph: "database",
    pattern:
      /データベース|\bdb\b|sql|テーブル|クエリ|query|保存|save|キャッシュ|cache|ストレージ|storage|永続|index|インデックス/i,
  },
  {
    glyph: "cloud",
    pattern:
      /クラウド|cloud|リージョン|region|サーバレス|serverless|スケール(アウト|イン)|aws|azure|gcp/i,
  },
  { glyph: "light", pattern: /ライト|light|光|照明|露出|ガンマ|影|shadow/i },
  {
    glyph: "palette",
    pattern:
      /色|カラー|color|マテリアル|material|テクスチャ|texture|シェーダ|shader|ペイント|塗|パレット/i,
  },
  {
    glyph: "camera",
    pattern:
      /カメラ|camera|レンダ|render|撮影|ビューポート|プレビュー|preview|視点/i,
  },
  {
    glyph: "joint",
    pattern:
      /リグ|ボーン|bone|スキン|skin|\bik\b|\bfk\b|アーマチュア|armature|ウェイト|weight|ジョイント|joint|コンストレイン/i,
  },
  {
    glyph: "timer",
    pattern:
      /タイムライン|timeline|タイマー|timer|待機|delay|遅延|時間|フレーム|frame|キーフレーム|keyframe|アニメーション|animation|モーション/i,
  },
  {
    glyph: "move",
    pattern: /移動|回転|変形|transform|move|rotate|ピボット|pivot|配置|位置/i,
  },
  { glyph: "scale", pattern: /拡大|縮小|スケール|scale|サイズ|size/i },
  {
    glyph: "cube",
    pattern:
      /メッシュ|mesh|ポリゴン|頂点|vertex|エッジ|押し出|extrude|ベベル|bevel|モデリング|形状|ジオメトリ|geometry|オブジェクト|object|立体|キューブ|cube|プリミティブ|面/i,
  },
  {
    glyph: "curve",
    pattern: /カーブ|curve|スプライン|spline|パス\b|軌道|ベジェ/i,
  },
  {
    glyph: "terminal",
    pattern: /コマンド|ターミナル|terminal|shell|\bcli\b|npm |git |docker /i,
  },
  {
    glyph: "braces",
    pattern:
      /関数|function|メソッド|method|クラス|class|変数|variable|定義|宣言|型/i,
  },
  {
    glyph: "code",
    pattern:
      /コード|code|スクリプト|script|記述|書く|書き|実装|式\b|expression|構文/i,
  },
  {
    glyph: "folder",
    pattern:
      /フォルダ|folder|ディレクトリ|directory|階層|hierarchy|アウトライナー/i,
  },
  {
    glyph: "file",
    pattern:
      /ファイル|file|ドキュメント|asset|アセット|リソース|resource|prefab|プレハブ/i,
  },
  {
    glyph: "search",
    pattern: /検索|探す|find|search|絞り|フィルタ|filter|調べ|選択|select/i,
  },
  {
    glyph: "edit",
    pattern: /編集|edit|変更|修正|更新|update|書き換|調整|adjust|適用|apply/i,
  },
  {
    glyph: "layers",
    pattern: /層|レイヤ|layer|スタック|stack|積|modifier|モディファイア|重ね/i,
  },
  {
    glyph: "box",
    pattern:
      /コンテナ|container|イメージ|image\b|仮想|\bvm\b|パッケージ|package|pod/i,
  },
  {
    glyph: "chart",
    pattern:
      /監視|ログ|log|metric|メトリクス|グラフ|chart|計測|プロファイル|profil|分析|比較|評価|統計/i,
  },
  {
    glyph: "sparkle",
    pattern:
      /\bai\b|モデル|学習|推論|プロンプト|prompt|埋め込み|embedding|llm/i,
  },
  {
    glyph: "user",
    pattern: /ユーザ|user|クライアント|client|画面|ui\b|入力|input|操作/i,
  },
  {
    glyph: "refresh",
    pattern: /繰り返|ループ|loop|反復|再試行|retry|更新を|同期|sync|リトライ/i,
  },
  {
    glyph: "flag",
    pattern: /完了|結果|出力|output|result|表示|返す|return|確認|check/i,
  },
];

export function inferGlyph(step: OperationStep): GlyphName {
  for (const rule of GLYPH_RULES) {
    if (rule.pattern.test(step.label)) return rule.glyph;
  }
  const rest = `${step.menuPath ?? ""} ${step.note ?? ""}`;
  for (const rule of GLYPH_RULES) {
    if (rule.pattern.test(rest)) return rule.glyph;
  }
  return "step";
}

/** 図の中に収めるための短い名前。かっこ書きを落とし、長いものは省略する */
export function shortLabel(label: string, max = 18): string {
  const trimmed = label.replace(/[((][^))]*[))]/g, "").trim() || label;
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

/** 1行あたりの文字数で折り返す(日本語を想定した字数ベース)。最大行数を超えたら省略 */
export function wrapLabel(label: string, perLine = 8, maxLines = 2): string[] {
  const text = shortLabel(label, perLine * maxLines);
  const lines: string[] = [];
  for (
    let start = 0;
    start < text.length && lines.length < maxLines;
    start += perLine
  ) {
    lines.push(text.slice(start, start + perLine));
  }
  return lines;
}
