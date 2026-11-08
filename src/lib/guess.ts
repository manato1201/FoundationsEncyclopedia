/**
 * 「先に予想」(Guess first)の純粋な部分。任意で、問いすぎない(LearnHarnessの「試された感」を避ける)ため、
 * 1回の再生で問うのは最大3か所だけ。採点も記録もしない。
 */
export const MAX_GUESS_PROMPTS = 3;

/** 予想を問う「遷移」の番号(stepIndex → stepIndex+1 の stepIndex)。手順が3つ未満なら問わない */
export function guessTransitions(stepCount: number): number[] {
  const transitions = stepCount - 1;
  if (transitions < 2) return [];
  if (transitions <= MAX_GUESS_PROMPTS) return Array.from({ length: transitions }, (_, index) => index);
  const picked = new Set<number>();
  for (let order = 0; order < MAX_GUESS_PROMPTS; order += 1) {
    picked.add(Math.round((order * (transitions - 1)) / (MAX_GUESS_PROMPTS - 1)));
  }
  return [...picked].sort((a, b) => a - b);
}

/**
 * 選択肢(手順の番号)。正解=次の手順 + この章の別の手順2つ。並びは stepIndex から決まる(再読込しても同じ)。
 * 返す correct は、返した配列の中での正解の位置。
 */
export function guessChoices(stepCount: number, stepIndex: number): { indices: number[]; correct: number } {
  const next = stepIndex + 1;
  const others: number[] = [];
  for (let index = 0; index < stepCount; index += 1) {
    if (index !== stepIndex && index !== next) others.push(index);
  }
  const picked: number[] = [];
  for (let offset = 0; offset < others.length && picked.length < 2; offset += 1) {
    const candidate = others[(stepIndex * 2 + offset) % others.length];
    if (!picked.includes(candidate)) picked.push(candidate);
  }
  const all = [next, ...picked];
  const shift = (stepIndex + stepCount) % all.length;
  const indices = all.map((_, position) => all[(position + shift) % all.length]);
  return { indices, correct: indices.indexOf(next) };
}
