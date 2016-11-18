'use strict';

var ws = new WebSocket('ws://testdocker-a6m1448l.cloudapp.net:3000');
// var ws = new WebSocket('ws://localhost:3000');

$(function () {
    $('form').submit(function() {
        var comment = { text:$('#m').val() };
        ws.send(JSON.stringify(comment));
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

