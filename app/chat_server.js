
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
        var comment = JSON.parse(message).text;
        var reply = getReply(comment);
        var obj = {
            success: flags.masked,
            text: comment,
            type: reply
        };
        console.log("json", obj);

        broadcast(JSON.stringify(obj));

        // bot反応判定
        if(reply === "bot") {
            reactPing(comment);
        }
        // else {
        //     broadcast(JSON.stringify(obj));
        // }

    });
});

function broadcast(message) {
    connections.forEach(function (con, i) {
        con.send(message);
    });
}

function getReply(comment) {
    var reply;
    for(var i = 0; i < 4; ++i) {
        reply += comment[i];
    }
    if(/bot/.test(reply)){
        return "bot";
    }
    return "message";
}

function reactPing(comment) {
    if(/ping/.test(comment)) {
        sentBot("pong");
    }
}

function sentBot(comment) {
    var obj = {
        success: true,
        text: comment,
        type: "bot"
    };
    broadcast(JSON.stringify(obj))
}

server.listen(3000);