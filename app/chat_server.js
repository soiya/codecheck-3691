
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
        console.log("message", message);
        var comment = JSON.parse(message);
        var reply = getReply(comment.text);
        var obj = {
            success: flags.masked,
            text: comment.text,
            type: reply
        };

        console.log("json", obj);

        broadcast(JSON.stringify(obj));

    });
});

//ブロードキャストを行う
function broadcast(message) {
    connections.forEach(function (con, i) {
        con.send(message);
    });
};

// bot通知判定
function getReply(comment) {
    var reply;
    for(var i = 0; i < 4; ++i) {
        reply += comment[i];
    }
    if(/bot/.test(reply)){
        return "bot";
    }
    return "message";
};

server.listen(3000);