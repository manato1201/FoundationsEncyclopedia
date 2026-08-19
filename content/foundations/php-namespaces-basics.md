---
name: 名前空間の基礎
category: プログラミング言語
subcategory: PHP
summary: クラス名の衝突を避けるための階層的な区分け。Composerのオートローディングとも密接に関わる。
---

## 概要

名前空間(namespace)は、クラス・関数・定数を階層的なグループに分け、異なるライブラリ間で同名のクラスが衝突するのを防ぐ仕組み。PHPの名前空間はバックスラッシュ`\`で区切られ、多くの場合ディレクトリ構造と対応する(PSR-4規約)。

## 基礎文法

```php
<?php
namespace App\Models;

class User {
    // ...
}
```

```php
<?php
namespace App\Controllers;

use App\Models\User; // 別の名前空間のクラスを使う場合はuseでインポートする

class UserController {
    public function show(): User {
        return new User();
    }
}
```

## つまずきやすい点

- `use`でインポートし忘れると、そのスコープ内では完全修飾名(`\App\Models\User`のようにバックスラッシュから書く)でしか参照できない。IDEの自動補完に頼らず手書きすると忘れやすい
- 名前空間とディレクトリ構造を一致させる規約(PSR-4)を守っていないと、Composerのオートローディングが機能せず「クラスが見つからない」エラーになる
- グローバル名前空間の関数(`strlen`等のPHP組み込み関数)は、名前空間内からでも`\`を付けずにそのまま呼べる。逆に自作の名前空間付き関数と組み込み関数が同名の場合、意図しない方が呼ばれることがあるため注意が必要

## 実装例(コード)

```php
<?php
namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository as Repo; // asでエイリアスを付けられる

class UserService {
    public function __construct(private Repo $repo) {}
}
```
