'use strict';

var ws = new WebSocket('ws://codecheck-3691.azurewebsites.net/app:3000');

$(function () {
    $('form').submit(function() {
        var comment = $('#m').val();
        var reply = getReply(comment);

        var obj = {
            success: true,
            text: comment,
            type: reply
        };

        ws.send(JSON.stringify(obj));

        $('#m').val('');
        return false;
    });

    ws.onmessage = function(resp){
        console.log("msg:", resp);
        var msg = JSON.parse(resp.data);
        $('#messages').append($('<li>').append($('<span class="message">').text(msg.text)));
    };

    ws.onerror = function(err){
        console.log("err", err);
    };

    ws.onclose = function close() {
        console.log('disconnected');
    };
});

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