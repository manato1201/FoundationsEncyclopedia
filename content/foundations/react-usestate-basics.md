---
name: "useStateの基礎(React)"
category: Framework
subcategory: "Web(Next.js等)"
summary: "コンポーネントが覚えておく値(state)を持つ仕組み。state を更新すると、画面が描き直される。"
claim: "state を更新すると、React が画面を描き直す。普通の変数を書き換えても、描き直されない。"
operationSteps:
  - label: "useStateで宣言する"
    note: "`const [count, setCount] = useState(0);` で、現在の値と、更新用の関数を受け取る"
  - label: "画面に state を表示する"
    note: "JSXの中で `{count}` と書くと、その時点の値が表示される"
  - label: "イベントで更新関数を呼ぶ"
    note: "ボタンの `onClick` などから `setCount(count + 1)` を呼ぶ"
  - label: "コンポーネントを再実行する"
    note: "state が変わると、コンポーネントの関数がもう一度呼ばれ、新しい値で JSX が作られる"
  - label: "画面の差分だけが更新される"
    note: "前回との違いを比べて、変わった部分だけが、実際の画面(DOM)に反映される"
quiz:
  - question: "state の値を直接書き換えず、更新用の関数を使うのはなぜか"
    choices:
      - "値が文字列になってしまうため"
      - "書き換えるとエラーで止まるため"
      - "Reactに変更を知らせて、再描画させるため"
    answer: 2
    explanation: "直接書き換えても、React は変更に気づけない。更新関数を呼ぶことで、再描画がスケジュールされる。"
---

## 概要

Reactのコンポーネントは、状態が変わるたびに関数として呼び直され、そのときの値から画面を作る。呼び直しをまたいで値を覚えておくために使うのが**state**で、`useState`というフックで宣言する。「画面は state の関数」と考えると、更新した値が、そのまま画面に反映される流れがつかみやすい。

## 基礎文法

```tsx
"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0); // 初期値 0

  return (
    <button onClick={() => setCount(count + 1)}>
      {count} 回押された
    </button>
  );
}
```

- `useState(初期値)`が返すのは、`[現在の値, 更新する関数]`の2つ
- フックは、コンポーネントの最上位で呼ぶ(条件分岐やループの中では呼ばない)
- Next.jsのApp Routerでは、`useState`を使うコンポーネントは、ファイルの先頭に`"use client"`が必要([ServerとClientの違い](/foundations/server-vs-client-components))

## つまずきやすい点

- 更新関数を呼んでも、同じ実行中の`count`はすぐには変わらない。新しい値は、次の再描画で見える。続けて2回`setCount(count + 1)`と書いても、1しか増えない
- 前の値をもとに更新するときは、`setCount((c) => c + 1)`のように、関数を渡す。これなら、続けて呼んでも、前の結果を受け取って積み上がる
- 配列やオブジェクトの state は、直接書き換えず、新しいものを作って渡す(`setItems([...items, newItem])`)。同じ参照のままだと、Reactは変更に気づけない
- state はコンポーネントごと(画面に置いた場所ごと)に独立している。同じコンポーネントを2つ置けば、別々の値を持つ

## 実装例(コード)

```tsx
"use client";
import { useState } from "react";

export function TodoList() {
  const [items, setItems] = useState<string[]>([]);
  const [text, setText] = useState("");

  const add = () => {
    if (text.trim() === "") return;
    setItems((prev) => [...prev, text]); // 新しい配列を作って渡す
    setText("");
  };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={add}>追加</button>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```
