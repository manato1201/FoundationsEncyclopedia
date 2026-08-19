---
name: 例外処理(try-catch-finally)
category: プログラミング言語
subcategory: Java
masteryBadge: next
summary: エラーの発生と、その後始末を分離して記述するための仕組み。検査例外と非検査例外の区別がJava特有。
---

## 概要

Javaの例外処理は`try`/`catch`/`finally`で構成される。加えてJavaには他の多くの言語にはない「検査例外(checked exception)」という概念があり、`IOException`のような検査例外は、呼び出し元でキャッチするかメソッドシグネチャで`throws`宣言することがコンパイラによって強制される。

## 基礎文法

```java
try {
    FileReader reader = new FileReader("data.txt");
    // ファイル読み込み処理
} catch (FileNotFoundException e) {
    System.err.println("ファイルが見つかりません: " + e.getMessage());
} finally {
    System.out.println("この処理は例外の有無に関わらず必ず実行される");
}
```

- **検査例外**: `IOException`等。呼び出し元でのキャッチまたは`throws`宣言が必須
- **非検査例外**: `RuntimeException`のサブクラス(`NullPointerException`等)。キャッチは任意で、プログラミングミスに起因することが多い

## つまずきやすい点

- `catch (Exception e) {}`のように例外を握りつぶす(何もしない)コードは、後から原因不明のバグの温床になる。最低限ログに出力するか、意図的に無視する理由をコメントで明示するべき
- 検査例外を安易に`RuntimeException`でラップして「握りつぶし」の手間を回避する設計は、呼び出し元がエラーの可能性に気づけなくなるリスクがある。検査例外の強制力を活かすか、あえて非検査例外に統一するかはチームの設計方針として決める必要がある
- `finally`ブロックの中で`return`すると、`try`/`catch`側の`return`値を上書きしてしまう。意図しない挙動になりやすいため、`finally`はリソース解放のような副作用のみに使うのが安全

## 実装例(コード)

```java
// try-with-resources: AutoCloseableを実装したリソースを自動的にクローズする
try (FileReader reader = new FileReader("data.txt")) {
    // ...
} catch (IOException e) {
    logger.error("読み込み失敗", e);
}
```
