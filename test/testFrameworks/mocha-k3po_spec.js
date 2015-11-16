require("../../lib/transports/TcpTransportFactory.js");
var assert = require('assert');
var net = require('net');

describe('TcpServer', function () {

    setScriptRoot('org/kaazing/specification/control/assets');

    it('client', function () {
        var server = net.createServer(function(socket){
            socket.on('data', function(data){
                assert.equal("echo", data.toString());
                socket.write('echo');
                socket.pipe(socket);
                socket.destroy();
            });
        });
        server.listen(8000, '127.0.0.1', k3poStart);
        k3poFinish(function(){
            server.close();
        });
    });

    it('client.with.barriers', function () {
        var server = net.createServer(function(socket){
            awaitBarrier("NOTIFYING_BARRIER", function(){
                notifyBarrier("AWAITING_BARRIER");
            });
            socket.on('data', function(data){
                assert.equal("echo", data.toString());
                socket.write('echo');
                socket.pipe(socket);
                socket.destroy();
            });
        });
        server.listen(8000, '127.0.0.1');
        k3poFinish(function(){
            server.close();
        });
    });

    it('client.with.barriers', function () {
        var server = net.createServer(function(socket){
            awaitBarrier("NOTIFYING_BARRIER", function(){
                notifyBarrier("AWAITING_BARRIER");
            });
            socket.on('data', function(data){
                assert.equal("echo", data.toString());
                socket.write('echo');
                socket.pipe(socket);
                socket.destroy();
                server.close();
            });
        });
        server.listen(8000, '127.0.0.1');
        k3poFinish();
    });

});
