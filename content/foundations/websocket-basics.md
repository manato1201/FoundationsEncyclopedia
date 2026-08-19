---
name: WebSocketの基礎
category: IT知識
subcategory: Webの基礎
summary: 1本のTCP接続を維持したまま、クライアントとサーバーが双方向にいつでもメッセージを送り合える通信方式。
---

## 概要

通常のHTTPは「クライアントがリクエストを送り、サーバーが応答する」という1往復のやり取りが基本だが、WebSocketは最初のハンドシェイクの後、1本のコネクションを維持したまま、クライアント・サーバーのどちらからでも自由にメッセージを送信できる双方向通信を実現する。チャットアプリやオンラインゲームのリアルタイム通信などで使われる。

## 基礎文法

```javascript
const socket = new WebSocket("wss://example.com/chat");

socket.onopen = () => {
  socket.send("こんにちは"); // サーバーへメッセージを送信
};

socket.onmessage = (event) => {
  console.log("受信:", event.data); // サーバーから任意のタイミングでメッセージが届く
};
```

## つまずきやすい点

- WebSocketは通常のHTTPリクエストとして開始され(Upgradeヘッダを使ったハンドシェイク)、成功すると別のプロトコルに切り替わる。ロードバランサーやプロキシがWebSocketに対応していないと、接続がうまく確立できないことがある
- HTTPと違い、WebSocketの接続はステートフル(接続そのものが状態を持つ)であり、[ロードバランシング](/foundations/load-balancing-basics)構成では「同じクライアントは常に同じサーバーへ接続を維持する」設計が必要になることが多い
- ネットワークが不安定な環境では接続が切断されることがあり、アプリケーション側で再接続の処理を実装しておかないと、ユーザーが気づかないうちに通信が止まっていることがある。[TCPとUDPの違い](/foundations/tcp-vs-udp)で触れたように、WebSocketはTCPベースであるため、パケットの到達順序や再送はTCP層が保証するが、接続自体の切断は自前で検知・復旧する必要がある

## 実装例(コード)

```javascript
function connectWithRetry(url) {
  const socket = new WebSocket(url);
  socket.onclose = () => {
    setTimeout(() => connectWithRetry(url), 3000); // 切断されたら再接続を試みる
  };
  return socket;
}
```
