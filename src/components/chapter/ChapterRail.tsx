"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import styles from "./ChapterRail.module.css";

type Tick = { offset: number; label: string };

/**
 * 章の目次レール(monochord): 画面右端に細い縦のレールを置き、ページ全体のうちの読んでいる位置を
 * つまみで示す。レールをクリック/ドラッグ、または矢印キーで、その位置へスクロールできる。
 * 目盛りは章の見出しの位置。左の目次(スクロールスパイ)は「どの見出しか」、レールは「全体のどこか」と
 * 役割を分けて併用する。幅が狭い画面では出さない。
 */
export function ChapterRail() {
  const [progress, setProgress] = useState(0);
  const [ticks, setTicks] = useState<Tick[]>([]);
  const dragging = useRef(false);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0);
      if (max <= 0) return setTicks([]);
      const headings = Array.from(
        document.querySelectorAll<HTMLElement>("main h2[id], main h1"),
      );
      setTicks(
        headings
          .filter((heading) => heading.offsetParent !== null)
          .map((heading) => ({
            offset: Math.min(
              (heading.getBoundingClientRect().top + window.scrollY) /
                (max + window.innerHeight),
              1,
            ),
            label: heading.textContent ?? "",
          })),
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    // タブ切替などで高さが変わったときも目盛りを測り直す
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, []);

  const scrollToRatio = (ratio: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: Math.min(Math.max(ratio, 0), 1) * max,
      behavior: "auto",
    });
  };

  const ratioFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const box = rail.current?.getBoundingClientRect();
    if (!box || box.height === 0) return 0;
    return (event.clientY - box.top) / box.height;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 0.05
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -0.05
          : 0;
    if (event.key === "Home") scrollToRatio(0);
    else if (event.key === "End") scrollToRatio(1);
    else if (step !== 0) scrollToRatio(progress + step);
    else return;
    event.preventDefault();
  };

  return (
    <div
      ref={rail}
      className={styles.rail}
      role="slider"
      tabIndex={0}
      aria-label="ページ内の位置"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        scrollToRatio(ratioFromPointer(event));
      }}
      onPointerMove={(event) => {
        if (dragging.current) scrollToRatio(ratioFromPointer(event));
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <span className={styles.line} aria-hidden="true" />
      {ticks.map((tick, index) => (
        <span
          key={index}
          className={styles.tick}
          style={{ top: `${tick.offset * 100}%` }}
          title={tick.label}
          aria-hidden="true"
        />
      ))}
      <span
        className={styles.thumb}
        style={{ top: `${progress * 100}%` }}
        aria-hidden="true"
      />
    </div>
  );
}
