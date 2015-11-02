require("../../src/node/TcpTransportFactory.js");

describe('TcpServer', function () {

    setScriptRoot('org/kaazing/specification/tcp/rfc793');

    it('server.sent.data/tcp.client', function (done) {
        k3poStart();
        k3poFinish();
        done();
    });

    //it('server.sent.data/tcp.client', function (done) {
    //    k3poFinish();
    //    done();
    //});

});
