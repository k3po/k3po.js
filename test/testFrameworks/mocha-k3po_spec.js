require("../../lib/transports/TcpTransportFactory.js");
var chai = require('chai');
var WebSocket = require('websocket').w3cwebsocket;

describe('WsClient', function () {

    //console.log(assert);
    k3poConfig.scriptRoot('org/kaazing/specification/ws/framing');
    browserConfig.origin('http://localhost:8080').addResource("http://chaijs.com/chai.js");

    it('echo.text.payload.length.125/handshake.response.and.frame', function (done) {
        var echoText = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345";
        var ws = new WebSocket("ws://localhost:8080/echo");
        ws.onopen = function () {
            ws.send(echoText);
        };
        ws.onmessage = function (event) {
            chai.assert.equal(event.data, echoText);
            ws.close();
        };

        ws.onclose = ws.onerror = function () {
            done();
        };

        //k3po.start().then(function () {
        //
        //});
        //k3po.await("barrier").then(function () {
        //
        //});
        //k3po.notify("barrier").then(function () {
        //
        //});
        //k3po.finish().then(function () {
        //    //mock.assert();
        //});
    });

    //it('echo.text.payload.length.125/handshake.response.and.frame', function (done) {
    //    var echoText = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345";
    //    var ws = new WebSocket("ws://localhost:8080/echo");
    //    ws.onopen = function () {
    //        ws.send(echoText);
    //    };
    //    ws.onmessage = function (event) {
    //        chai.assert.equal(event.data, echoText);
    //        k3po.finish().then(function () {
    //            done();
    //        });
    //        ws.close();
    //    };
    //    ws.onerror = done;
    //});
});
