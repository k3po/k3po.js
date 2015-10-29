'use strict';

exports.k3poControlTest = {
    setUp: function (done) {
        var K3poControl = require('../src/base/K3poControl.js');
        this.testRobotControl = new K3poControl(false);
        done();
    },

    testMakePrepare: function (test) {
        test.expect(2);
        var prepareMsg1 = this.testRobotControl.makePrepare();
        test.equal(prepareMsg1, "PREPARE\nversion:2.0\n\n");
        var script1 = "script/path/1";
        var script2 = "script";
        var prepareMsg2 = this.testRobotControl.makePrepare([script1, script2]);
        test.equal(prepareMsg2, "PREPARE\nversion:2.0\nname:" + script1 + "\nname:" + script2 + "\n\n");
        test.done();
    },

    testMakeStart: function (test) {
        test.expect(1);
        var startMsg = this.testRobotControl.makeStart();
        test.equal(startMsg, "START\n\n");
        test.done();
    },

    testMakeAbort: function (test) {
        test.expect(1);
        var abortMsg = this.testRobotControl.makeAbort();
        test.equal(abortMsg, "ABORT\n\n");
        test.done();
    },

    testHandlePrepared: function (test) {

        this.testRobotControl.onStarted = function () {
            test.failed("Unexpected onStarted");
        };
        this.testRobotControl.onFinished = function () {
            test.failed("Unexpected onFinished");
        };
        this.testRobotControl.onError = function () {
            test.failed("Unexpected onError");
        };

        test.expect(2);
        var script = "# server\n" +
            "accept tcp://localhost:8000\n" +
            "accepted\n" +
            "connected\n" +
            "read \"echo\"\n" +
            "write \"echo\"\n" +
            "close\n" +
            "closed\n" +
            "# client\n" +
            "connect tcp://localhost:8000\n" +
            "connected\n" +
            "\"echo\"\n" +
            "read \"echo\"\n" +
            "closed\n";

        var prepared = "PREPARED\n" +
            "content-length:0\n" +
            "\n";

        var prepared2 = "PREPARED\n" +
            "content-length:168\n" +
            "\n" +
            script;

        this.testRobotControl.onPrepared = function (expectedScript) {
            test.equal("", expectedScript);
        };

        this.testRobotControl.handleEvent(prepared);

        this.testRobotControl.onPrepared = function (expectedScript) {
            test.equal(script, expectedScript);
        };

        this.testRobotControl.handleEvent(prepared2);

        test.done();
    },

    testHandleStarted: function (test) {

        this.testRobotControl.onPrepared = function () {
            test.failed("Unexpected onPrepared");
        };
        this.testRobotControl.onFinished = function () {
            test.failed("Unexpected onFinished");
        };
        this.testRobotControl.onError = function () {
            test.failed("Unexpected onError");
        };

        var started = "STARTED\n\n";
        test.expect(1);
        this.testRobotControl.onStarted = function () {
            test.equal(true, true);
        };
        this.testRobotControl.handleEvent(started);
        test.done();
    },

    testHandleFinished: function (test) {

        this.testRobotControl.onPrepared = function () {
            test.failed("Unexpected onPrepared");
        };
        this.testRobotControl.onStarted = function () {
            test.failed("Unexpected onStarted");
        };
        this.testRobotControl.onError = function () {
            test.failed("Unexpected onError");
        };

        var finished = "FINISHED\ncontent-length:0\n\n";
        test.expect(1);
        this.testRobotControl.onFinished = function (observeredScript) {
            test.equal("", observeredScript);
        };
        this.testRobotControl.handleEvent(finished);
        test.done();
    },

    testHandleUnrecognized: function (test) {

        this.testRobotControl.onPrepared = function () {
            test.failed("Unexpected onPrepared");
        };
        this.testRobotControl.onStarted = function () {
            test.failed("Unexpected onStarted");
        };
        this.testRobotControl.onFinished = function () {
            test.failed("Unexpected onFinished");
        };

        var junkMsg = "NOTACOMMAND\ncontent-length:0\n\n";
        test.expect(1);
        this.testRobotControl.onError = function (errorMsg) {
            test.equal("Unrecognized event type: NOTACOMMAND", errorMsg);
        };
        this.testRobotControl.handleEvent(junkMsg);
        test.done();
    }
};


