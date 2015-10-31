require("../../src/node/TcpTransportFactory.js");

describe('TcpServer', function () {
    it('should.accept', function (done) {
        k3poStart();

        k3poFinish();
        done();
    });

    it('should.accept.and.send.data', function (done) {
        k3poFinish();
        done();
    });

});
