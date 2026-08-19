"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./ContainerLayersAnimation.module.css";

const LAYERS = [
  { key: "base", label: "FROM node:20-alpine" },
  { key: "workdir", label: "WORKDIR /app" },
  { key: "copy", label: "COPY package.json" },
  { key: "install", label: "RUN npm install" },
];

/**
 * コンテナイメージのレイヤー構造(Dockerfileの各命令が差分レイヤーとして積み重なる様子)。
 * Blenderモディファイアスタックと同じ「上から順に積み重なる」性質を持つ題材のため、
 * 同型のスタック表現で実装する。
 */
export function ContainerLayersAnimation() {
  return (
    <CssStepAnimation frameCount={4}>
      <div className={styles.stack}>
        {LAYERS.map((layer, index) => (
          <div
            key={layer.key}
            className={`${styles.layer} ${styles[`layer${index}`]}`}
          >
            {layer.label}
          </div>
        ))}
        <p className={styles.caption} data-caption="0">
          ベースイメージのレイヤー(FROM)。
        </p>
        <p className={styles.caption} data-caption="1">
          作業ディレクトリの変更がレイヤーとして積まれる(WORKDIR)。
        </p>
        <p className={styles.caption} data-caption="2">
          依存関係の定義ファイルだけを先にコピーする(COPY)。
        </p>
        <p className={styles.caption} data-caption="3">
          依存関係をインストールし、その結果もレイヤーとして保存される(RUN)。以降アプリコードだけが変わっても、ここまでのレイヤーはキャッシュされる。
        </p>
      </div>
    </CssStepAnimation>
  );
}
