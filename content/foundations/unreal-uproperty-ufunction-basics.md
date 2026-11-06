---
name: "UPROPERTYとUFUNCTIONの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "C++の変数や関数を、エディタやBlueprintから使えるように、マクロで公開する。"
operationSteps:
  - label: "C++のクラスを作る"
    note: "UCLASSのマクロを付けた、クラスを作る"
  - label: "変数にUPROPERTYを付ける"
    note: "エディタやBlueprintで、見える・編集できる変数にする"
  - label: "関数にUFUNCTIONを付ける"
    note: "Blueprintから呼び出せる関数にする"
  - label: "公開の範囲を指定する"
    note: "EditAnywhere・BlueprintReadWriteなど、指定子で、できることを決める"
  - label: "コンパイルして確認する"
    note: "ビルド後、エディタに、公開した項目が表示されるか確認する"
---

## 概要

Unreal EngineのC++では、**UPROPERTY**と**UFUNCTION**というマクロを付けて、変数や関数を**エンジンに登録**する。これで、エディタで値を編集したり、Blueprintから呼んだりできる。ガベージコレクションの対象としても管理される。

## 基礎文法

| マクロ | 役割 |
| --- | --- |
| UPROPERTY | 変数を、エンジンへ公開する |
| UFUNCTION | 関数を、エンジンへ公開する |
| EditAnywhere / BlueprintReadWrite | 編集・読み書きの許可 |

## つまずきやすい点

- UPROPERTYのないUObjectの参照は、ガベージコレクションで消えることがある。保持するポインターには、付けておく
- マクロを付けても、ヘッダーの構成(generated.h)が正しくないと、ビルドに失敗する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
UCLASS()
class AMyActor : public AActor
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    float Speed = 100.f;

    UFUNCTION(BlueprintCallable)
    void Boost();
};
```
