import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Space_Grotesk, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/hud/AppShell";

// 幾何学ゴシック(和文見出し用) — variableフォント非対応のため明示的にweightを指定
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-display-raw",
});

// 英数字見出し・カテゴリ表記用
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display-en-raw",
});

// 本文用(和文)
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-body-raw",
});

// コード・データ・状態値用(等幅)
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-raw",
});

export const metadata: Metadata = {
  title: "基礎学習図鑑 | FoundationsEncyclopedia",
  description:
    "プログラミング言語・IT知識・DCC・ツール別・Frameworkという専門分野の土台になる基礎知識を、カタログ・詳細・CSSステップアニメーションの3層で見せる学習図鑑。",
};

/** 初回描画前にテーマを確定する(保存値 → なければOS設定)。ちらつき防止のためインラインで同期実行する。 */
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("fe-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}try{var d=document.documentElement,os=window.matchMedia("(prefers-reduced-motion: reduce)").matches,m=localStorage.getItem("fe-motion");d.dataset.motion=os||m==="reduce"?"reduce":"full";if(os)d.dataset.motionOs="reduce"}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${zenKakuGothicNew.variable} ${spaceGrotesk.variable} ${notoSansJP.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
