/**
 * ASCII の結晶(6回対称の雪の結晶のような形)を、決まった文字列として生成する。
 * 乱数も時刻も使わないので、サーバー描画とクライアント描画で必ず同じ結果になる(静止画1枚)。
 *
 * 考え方: 中心からの距離 r と角度 θ を 60° の扇形に折り返し、①主枝(中心から伸びる線)と
 * ②側枝(主枝から60°で分かれる短い線)までの距離が近いほど濃い字にする。
 * 文字の縦横比は約2:1なので、縦方向は2倍に伸ばして距離を測る。
 * 本文・操作部品には使わず、ヒーロー・空状態・404の装飾にだけ使う(P8)。
 */
const RAMP = " .:+*#@";
/** 主枝の太さ・側枝の太さ(文字単位) */
const ARM_WIDTH = 1.7;
const BRANCH_WIDTH = 1.5;
/** 側枝が主枝から分かれる位置(半径に対する割合) */
const BRANCH_AT = [0.34, 0.56, 0.78];

export function asciiCrystal(cols = 49, rows = 25): string {
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const radius = Math.min(cx, cy * 2) - 0.5;
  const sector = Math.PI / 3;
  const cos60 = Math.cos(Math.PI / 3);
  const sin60 = Math.sin(Math.PI / 3);

  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      const dx = x - cx;
      const dy = (y - cy) * 2;
      const r = Math.hypot(dx, dy);
      if (r > radius) {
        line += " ";
        continue;
      }

      // 60°の扇形に折り返し、さらに主枝からの角度(0〜30°)にそろえる
      const angle = ((Math.atan2(dy, dx) % sector) + sector) % sector;
      const m = Math.min(angle, sector - angle);
      const u = r * Math.cos(m);
      const v = r * Math.sin(m);

      let value = Math.max(0, 1 - v / ARM_WIDTH);
      for (const at of BRANCH_AT) {
        const length = (radius - at * radius) * 0.5;
        const px = u - at * radius;
        const t = Math.min(Math.max(px * cos60 + v * sin60, 0), length);
        const d = Math.hypot(px - t * cos60, v - t * sin60);
        value = Math.max(value, Math.max(0, 1 - d / BRANCH_WIDTH) * 0.8);
      }
      if (r < 1.6) value = 1;

      line += RAMP[Math.min(RAMP.length - 1, Math.floor(value * RAMP.length))];
    }
    lines.push(line.replace(/\s+$/, ""));
  }
  return lines.join("\n");
}
