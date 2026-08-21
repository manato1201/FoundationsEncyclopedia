---
name: 文字列の基礎(char型を持たない設計)
category: プログラミング言語
subcategory: TypeScript
masteryBadge: done
summary: TypeScriptにもPythonと同様charという専用型がなく、1文字は「長さ1の文字列」として扱われる。
---

## 概要

TypeScript(JavaScript)には、[C#のchar型](/foundations/csharp-strings-basics)のような1文字専用の型がない。[Pythonの文字列](/foundations/python-strings-basics)と同様、1文字を取り出してもそれは`string`型のままで、「長さ1の文字列」として扱われる。

## 基礎文法

```typescript
const name: string = "Player";
const firstChar: string = name[0]; // "P" (これもstring型)
// name[0] = "X"; // エラーにはならないが、実際には変更されない(文字列はイミュータブル)

const chars: string[] = name.split(""); // 1文字ずつの配列に変換
chars[0] = "X";
const modified: string = chars.join(""); // "Xlayer"

const length: number = name.length;
```

## つまずきやすい点

- 文字列はイミュータブルなため、`name[0] = "X"`はエラーにならずに黙って無視される(strictモードでない環境依存の挙動もある)。C#のようにコンパイルエラーで教えてくれるわけではないため、「書き換えたつもりが変わっていない」というバグに気づきにくい
- `.length`が返す値は、絵文字のような一部の文字(サロゲートペアを使う文字)では「見た目の文字数」と一致しないことがある。[C#の文字列とchar配列の基礎](/foundations/csharp-strings-basics)で触れたのと同種の問題が、JavaScriptのUTF-16ベースの文字列表現にも存在する
- テンプレートリテラル(バッククォート`` ` ``で囲む書き方)を使うと、変数の埋め込みや複数行文字列を簡潔に書ける。旧来の`+`による文字列連結よりも可読性が高く、現在のTypeScript/JavaScriptコードでは基本的にこちらが推奨される

## 実装例(コード)

```typescript
// テンプレートリテラルでの文字列構築
const name = "Alice";
const score = 90;
const message = `${name}さんのスコアは${score}点です`; // 変数を直接埋め込める
```
