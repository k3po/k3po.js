'use strict';

exports.k3poNodeunitIntegrationTest = {
    setUp: function (done) {
        this.K3poAssert = require('../src/K3poNodeunitAssert.js');
        done();
    },

    testRunControlProtocolPass: function (test) {
        test.expect(2);
        var k3po = new this.K3poAssert(test, {
                "scripts": ["org/kaazing/robotic/control/accept.finished.empty", "org/kaazing/robotic/control/connect.finished.empty"],
                "verbose": true
            },
            function () {
                k3po.assert(function(){
                    test.done();
                });
                // extra assert to show count of asserts is working
                test.equal(true, true);
            }
        );
    }
};

