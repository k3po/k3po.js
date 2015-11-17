require("../../lib/transports/TcpTransportFactory.js");
var assert = require('assert');
var net = require('net');

describe('TcpServer', function () {
    //
    //scriptRoot('org/kaazing/specification/ws/framing');
    //
    //this.timeout(10000);
    //it('echo.text.payload.length.125/handshake.response.and.frame', function () {
    //    //todo
    //    var ws = new WebSocket("ws://localhost:8080/echo");
    //    ws.onopen = function () {
    //        ws.send("12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345");
    //    };
    //    ws.ondata = function () {
    //        k3poFinish(function(){
    //            ws.close()
    //        });
    //    };
    //});
    //
    //it('echo.text.payload.length.125/handshake.response.and.frame', function (done) {
    //    //todo
    //    var ws = new WebSocket("ws://localhost:8080/echo");
    //    ws.onopen = function () {
    //        ws.send("12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345");
    //    };
    //    ws.ondata = function () {
    //        // TODO: verify echoed payload
    //        ws.close();
    //        done();
    //    };
    //    ws.onerror = done;
    //
    //    k3po.start().then(...);
    //    k3po.await("barrier").then(...);
    //    k3po.notify("barrier").then(...);
    //    k3po.finish().then(function(){
    //        mock.assert();
    //    });
    //});

});
