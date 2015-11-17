require("../../lib/transports/TcpTransportFactory.js");
var assert = require('assert');
var net = require('net');
var WebSocket = require('websocket').w3cwebsocket;

describe('WsClient', function () {

    var hmm = k3poConfig;
    hmm.scriptRoot('org/kaazing/specification/ws/framing');//._url("tcp://localhost");

    it('echo.text.payload.length.125/handshake.response.and.frame', function (done) {
        //todo
        var ws = new WebSocket("ws://localhost:8080/echo");
        ws.onopen = function () {
            ws.send("12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345");
        };
        ws.ondata = function () {
            // TODO: verify echoed payload
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
});
