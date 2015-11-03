require("../../src/node/TcpTransportFactory.js");

var net = require('net');

describe('TcpServer', function () {

    setScriptRoot('org/kaazing/specification/tcp/rfc793');

    it('server.sent.data/tcp.client', function () {
        var server = net.createServer(function(socket){
            socket.write('server data');
            socket.pipe(socket);
            k3poFinish(function(){
                socket.destroy();
                server.close();
            });
        });
        server.listen(8080, '127.0.0.1', k3poStart);
    });

    //it('server.sent.data/tcp.client', function (done) {
    //    var server = net.createServer(function(socket){
    //        socket.on('data', function(data){
    //            socket.write('echo');
    //            socket.pipe(socket);
    //            k3poFinish(function(){
    //                socket.destroy();
    //                server.close();
    //            });
    //        });
    //    });
    //    server.listen(8000, '127.0.0.1', k3poStart);
    //    awaitBarier("NOTIFYING_BARRIER", function(){
    //        notifyBarrier("AWAITING_BARRIER");
    //    });
    //});

});
