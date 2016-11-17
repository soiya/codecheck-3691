
var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express();

app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
var wss = new WebSocketServer({server:server});

//Websocket接続を保存しておく
var connections = [];

//接続時
wss.on('connection', function (ws) {
    //配列にWebSocket接続を保存
    connections.push(ws);
    //切断時
    ws.on('close', function () {
        connections = connections.filter(function (conn, i) {
            return (conn !== ws);
        });
    });
    //メッセージ送信時
    ws.on('message', function (message, flags) {
        console.log("flag", flags);
        broadcast(message);
    });
});

//ブロードキャストを行う
function broadcast(message) {
    connections.forEach(function (con, i) {
        con.send(message);
    });
};

server.listen(8080);