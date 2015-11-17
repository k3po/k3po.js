require("../../lib/transports/TcpTransportFactory.js");
var assert = require('assert');
var net = require('net');
var WebSocket = require('websocket').w3cwebsocket;

describe('WsClient', function () {

    k3poConfig.scriptRoot('org/kaazing/specification/ws/framing');

    it('echo.text.payload.length.125/handshake.response.and.frame', function (done) {
        var echoText = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345";
        var ws = new WebSocket("ws://localhost:8080/echo");
        ws.onopen = function () {
            ws.send(echoText);
        };
        ws.onmessage = function (event) {
            assert.equal(event.data, echoText);
            ws.close();
            done();
        };
        ws.onerror = done;

        k3po.start().then(function () {

        });
        //k3po.await("barrier").then(function () {
        //
        //});
        //k3po.notify("barrier").then(function () {
        //
        //});
        k3po.finish().then(function () {
            //mock.assert();
        });
    });

    this.timeout(5000);
    it('echo.text.payload.length.125/handshake.response.and.frame', function (done) {
        var echoText = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345";
        var ws = new WebSocket("ws://localhost:8080/echo");
        ws.onopen = function () {
            ws.send(echoText);
        };
        ws.onmessage = function (event) {
            assert.equal(event.data, echoText);
            k3po.finish().then(function(){
                done();
            });
            ws.close();
        };
        ws.onerror = done;
    });
});
