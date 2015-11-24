require("../../lib/transports/TcpTransportFactory.js");
var chai = require('chai');
var WebSocket = require('websocket').w3cwebsocket;

describe('WsClient', function () {

    //console.log(assert);
    k3poConfig.scriptRoot('org/kaazing/specification/utils');
    browserConfig.origin('http://localhost:8080').addResource("http://chaijs.com/chai.js");

    try{
        this.timeout(0);
    }catch(e){
        console.log(e);
    }

    it('full.feature.test/server', function (done) {

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

    it('full.feature.test/server', function (done) {
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

});
