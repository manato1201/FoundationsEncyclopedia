---
name: 自作関数(メソッド)の基礎
category: プログラミング言語
subcategory: Java
masteryBadge: done
summary: JavaはC#と同様、関数はクラス内の「メソッド」として定義する。全ての引数は値渡しである点が特徴。
---

## 概要

Javaの関数は[C#の自作関数の基礎](/foundations/csharp-custom-functions-basics)と同様、クラス内にメソッドとして定義する静的型付けの文法を持つ。C#と大きく異なる点として、Javaには`ref`/`out`のような参照渡しの仕組みが一切なく、全ての引数は常に値渡しで統一されている。

## 基礎文法

```java
int add(int a, int b) {
    return a + b;
}

void printMessage(String message) {
    System.out.println(message);
}

// Javaにはデフォルト引数がない。オーバーロードで代用する
void takeDamage(int amount) {
    takeDamage(amount, false);
}
void takeDamage(int amount, boolean isCritical) {
    // ...
}
```

## つまずきやすい点

- 「Javaは全て値渡し」と言われるが、参照型の変数を渡した場合、渡されるのは「参照のコピー」であるため、メソッド内でオブジェクトのフィールドを変更すると呼び出し元にも影響する(オブジェクト自体は共有されている)。ただし、メソッド内でその変数自体に別のオブジェクトを再代入しても、呼び出し元の変数は元のオブジェクトを指したままになる。この「値渡しだが参照の値が渡される」という二重の性質が誤解を生みやすい
- JavaにはC#のデフォルト引数(`bool isCritical = false`のような記法)がない。同じ処理を異なる引数の数で呼べるようにしたい場合は、メソッドのオーバーロードで代用する必要がある
- メソッドのオーバーロードは、引数の「型」や「数」で区別されるが、戻り値の型だけが異なるオーバーロードは許可されない。「戻り値だけ変えたメソッドを定義したい」という発想はJavaでは通用しない

## 実装例(コード)

```java
// 参照型引数の「値渡しだが参照は共有される」性質の例
void addScore(List<Integer> scores) {
    scores.add(100); // 呼び出し元のリストにも反映される(同じオブジェクトを参照しているため)
}

void reassign(List<Integer> scores) {
    scores = new ArrayList<>(); // 呼び出し元の変数には影響しない(ローカルの再代入)
}
```
