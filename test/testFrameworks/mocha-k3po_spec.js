require("../../lib/transports/TcpTransportFactory.js");
var chai = require('chai');
var WebSocket = require('websocket').w3cwebsocket;

describe('WsClient', function () {

    browserConfig.origin('http://localhost:8080').addResource("http://chaijs.com/chai.js");

    it('echo.from.ws.server', function (done) {

        var echoText = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345";
        var ws = new WebSocket("ws://localhost:8080/echo");
        ws.onopen = function () {
            k3po.notify("CLIENT_READY_TO_READ");
            k3po.await("SERVER_READY_TO_READ").then(function () {
                ws.send(echoText);
            });
        };

        ws.onmessage = function (event) {
            chai.assert.equal(event.data, echoText);
            ws.close();
        };

        ws.onclose = ws.onerror = function () {
            done();
        };
    });

    it('echo.from.ws.server', function (done) {
        var echoText = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345";
        var ws = new WebSocket("ws://localhost:8080/echo");
        ws.onopen = function () {
            k3po.notify("CLIENT_READY_TO_READ");
            k3po.await("SERVER_READY_TO_READ").then(function () {
                ws.send(echoText);
            });
        };

        ws.onmessage = function (event) {
            chai.assert.equal(event.data, echoText);
            ws.close();
        };

        ws.onclose = ws.onerror = function () {
        };

        k3po.finish().then(function () {
            done();
        });
    });


    //// Demo assertion error
    //it('echo.from.ws.server', function (done) {
    //    var echoText = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345";
    //    var ws = new WebSocket("ws://localhost:8080/echo");
    //    ws.onopen = function () {
    //        k3po.notify("CLIENT_READY_TO_READ");
    //        k3po.await("SERVER_READY_TO_READ").then(function () {
    //            ws.send(echoText);
    //        });
    //    };
    //
    //    ws.onmessage = function (event) {
    //        // what to do about exceptions
    //        chai.assert.equal(false, true);
    //        ws.close();
    //    };
    //
    //    ws.onclose = ws.onerror = function () {
    //    };
    //
    //    k3po.finish().then(function () {
    //        done();
    //    });
    //});

    //// Demo script diff
    //it('echo.from.ws.server', function (done) {
    //    var echoText = "bad expectations";
    //    var ws = new WebSocket("ws://localhost:8080/echo");
    //    ws.onopen = function () {
    //        k3po.notify("CLIENT_READY_TO_READ");
    //        k3po.await("SERVER_READY_TO_READ").then(function () {
    //            ws.send(echoText);
    //            k3po.finish().then(function () {
    //                done();
    //            });
    //        });
    //    };
    //
    //    ws.onmessage = function (event) {
    //        chai.assert.equal(event.data, echoText);
    //        ws.close();
    //    };
    //
    //    ws.onclose = ws.onerror = function () {
    //    };
    //
    //});
});
