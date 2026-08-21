---
name: ポインタの基礎
category: プログラミング言語
subcategory: Go
masteryBadge: review
summary: Goのポインタはアドレスを扱う点はC++と同じだが、ポインタ演算(加減算)ができない安全な設計になっている。
---

## 概要

Goのポインタは、[C++のポインタの基礎](/foundations/cpp-pointers-basics)と同様に変数のメモリアドレスを保持するが、決定的に異なるのは「ポインタ演算(`p + 1`のようなアドレスへの加減算)ができない」という制約。この制約により、C++のポインタが持つ柔軟性の一部を犠牲にしつつ、ポインタが原因となるメモリ破壊のリスクを大幅に減らしている。

## つまずきやすい点

- Goには[C++のスマートポインタ](/foundations/cpp-smart-pointers)のような手動でのメモリ解放は不要。Goは[ガベージコレクション](/foundations/java-garbage-collection-basics)を持つため、ポインタが指すメモリがいつ解放されるかを開発者が管理する必要はない。「アドレスは直接扱えるが、解放はGCに任せる」という、C++とC#/Javaの中間のような設計になっている
- 関数に構造体を渡す際、値渡し(コピー)かポインタ渡し(共有)かで挙動が変わる。[Javaの「値渡しだが参照は共有される」性質](/foundations/java-custom-functions-basics)とは異なり、Goでは構造体はデフォルトで値渡し(コピー)になるため、関数内で変更を呼び出し元に反映したい場合は、明示的にポインタ(`*Type`)で渡す必要がある
- `nil`ポインタを逆参照すると、パニック(実行時エラー)が発生する。[C++の未初期化ポインタの逆参照](/foundations/cpp-pointers-basics)と異なり、Goでは常に検出可能な形でクラッシュするため、原因不明のメモリ破壊にはなりにくい

## 実装例(コード)

```go
// 構造体をポインタで渡して変更を反映させる例
type Player struct { HP int }

func takeDamage(p *Player, amount int) {
    p.HP -= amount // ポインタ経由で元の構造体を直接変更する
}

player := Player{HP: 100}
takeDamage(&player, 10)
fmt.Println(player.HP) // 90 (呼び出し元にも反映されている)
```
