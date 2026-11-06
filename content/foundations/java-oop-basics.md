---
name: Javaにおけるクラスとインターフェース
category: プログラミング言語
subcategory: Java
summary: クラスによる実装の継承と、インターフェースによる契約の分離。Javaのオブジェクト指向設計の基本単位。
operationSteps:
  - label: "クラスで設計図を作る"
    note: "フィールドとメソッドを持つ、クラスを定義する"
  - label: "newでインスタンスを作る"
    note: "クラスから、オブジェクトを作る"
  - label: "継承で機能を引き継ぐ"
    note: "extends で、親クラスの機能を引き継ぐ(親は1つだけ)"
  - label: "インターフェースで契約を決める"
    note: "implements で、必要なメソッドを実装する(複数可)"
  - label: "多態性で同じ呼び出しをする"
    note: "親やインターフェースの型で受けて、実際の型の動きをさせる"
---

## 概要

Javaは単一継承(`extends`できるクラスは1つだけ)のオブジェクト指向言語で、複数の型に共通の振る舞いを持たせたい場合はインターフェース(`implements`、複数実装可能)を使う。クラスは「状態(フィールド)と実装(メソッド)」を持ち、インターフェースは「契約(メソッドのシグネチャ)」を定義する。

## 基礎文法

```java
interface Damageable {
    void takeDamage(int amount);
}

class Enemy implements Damageable {
    private int hp = 100;

    @Override
    public void takeDamage(int amount) {
        hp -= amount;
    }
}

class Boss extends Enemy { // Enemyを継承し、機能を拡張する
    // ...
}
```

## つまずきやすい点

- Javaは多重継承(複数のクラスを同時に`extends`すること)を許さない。共通ロジックを複数箇所で使いたい場合は、継承ではなくインターフェースのデフォルトメソッドやコンポジション(委譲)で解決するのが定石
- `interface`のデフォルトメソッド(Java 8以降)は実装を持てるため、抽象クラスとの違いが分かりにくくなることがある。フィールド(状態)を持てるかどうかが大きな違い(インターフェースは`static final`の定数しか持てない)
- `@Override`アノテーションを付け忘れると、メソッド名のタイプミス(親のメソッドをオーバーライドしたつもりが、実は新しいメソッドとして定義されている)に気づけないことがある。付けておくとコンパイラがチェックしてくれる

## 実装例(コード)

```java
abstract class Shape {
    abstract double area(); // 実装は持たず、サブクラスに強制する

    void printArea() { // 共通の実装は抽象クラス側に持てる
        System.out.println("面積: " + area());
    }
}
```
