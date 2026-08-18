---
name: ECS(Entity Component System)の基礎
category: Framework
subcategory: ゲームエンジン基盤
summary: 「継承」ではなく「データの組み合わせ」でオブジェクトの振る舞いを表現する設計パターン。
---

## 概要

ECS(Entity Component System)は、多くのゲームエンジンの内部やパフォーマンス重視のシステムで採用される設計パターン。オブジェクト指向の「継承」でクラス階層を作る代わりに、Entity(識別子)にComponent(純粋なデータ)を組み合わせ、System(振る舞いを処理するロジック)がそれらを横断的に処理する。

## 基礎文法

3つの要素の役割分担:

- **Entity**: それ自体はデータを持たない、単なるID(「何かが存在する」という印だけ)
- **Component**: 位置・速度・体力など、純粋なデータの塊(振る舞いのコードは持たない)
- **System**: 「PositionとVelocityを持つ全Entity」のように条件に合うEntity群をまとめて処理するロジック

## つまずきやすい点

- オブジェクト指向の「継承」に慣れていると、「Enemyクラスを継承してBossクラスを作る」という発想が染み付いているため、「継承せずコンポーネントの組み合わせで差別化する」という発想の転換に最初は戸惑いやすい
- Systemはデータ(Component)への参照だけを持ち、Entity間の直接参照(オブジェクト指向的な「このオブジェクトが別のオブジェクトを持つ」関係)を避けるのが基本方針。ここを崩すとECSの並列処理・キャッシュ効率のメリットが薄れる
- 「継承ベースの設計をECSに書き換える」判断は常に必要なわけではない。大量の同種オブジェクトを高速に処理する必要がある場面で特に威力を発揮する設計であり、全てをECS化する必要はない

## 実装例(コード)

```csharp
// Component: データのみ
struct Position { public float X, Y; }
struct Velocity { public float X, Y; }

// System: PositionとVelocityを持つEntity群をまとめて処理する
void MovementSystem(ref Position pos, in Velocity vel, float deltaTime) {
    pos.X += vel.X * deltaTime;
    pos.Y += vel.Y * deltaTime;
}
```
