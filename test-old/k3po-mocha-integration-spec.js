'use strict';

var K3poTest = require('../src/K3poTest.js');

describe("hello world robot test", function () {
    var k3poTest;
    beforeEach(function () {
//        var onError = function (errorMsg) {
//            assert.ifError(errorMsg);
//        };
//        var onAssert = function (expected, actual) {
//            assert.equal(expected, actual, "Observed and expected scripts are the same");
//        };
//        k3poTest = new K3poTest(onError, onAssert);
        k3poTest = new K3poTest();
    });

    it("empty robot script test", function (done) {
            k3poTest.test(
                {"scripts": ["org/kaazing/robotic/control/accept.finished.empty", "org/kaazing/robotic/control/connect.finished.empty"]},
                function () {
                    k3poTest.finish(done);
                }
            );
        }
    );

    it("contains a robot script with an expectation", function (done) {
            k3poTest.test(
                {"scripts": ["org/kaazing/robotic/control/accept.finished.with.diff", "org/kaazing/robotic/control/connect.finished.with.diff"]},
                function () {
                    k3poTest.finish(done);
                }
            );
        }
    );

// promise example
//    it("contains a robot script with an expectation", function (done) {
//            var promise = k3poTest.test(
//                "org/kaazing/robotic/control/accept.finished.empty",
//                "org/kaazing/robotic/control/connect.finished.empty");
//            promise.then(
//                function(){k3poTest.start();}).then(function(){done();});
//    );

});
