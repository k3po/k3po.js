'use strict';

var K3poControl = require('../../lib/Control.js');
var AbortCommand = require('../../lib/commands/AbortCommand.js');
var AwaitCommand = require('../../lib/commands/AwaitCommand.js');
var NotifyCommand = require('../../lib/commands/NotifyCommand.js');
var PrepareCommand = require('../../lib/commands/PrepareCommand.js');
var StartCommand = require('../../lib/commands/StartCommand.js');
var ControlTransportApi = require('../../lib/transports/ControlTransportApi.js');
var ControlTransportFactorySpi = require('../../lib/transports/ControlTransportFactorySpi.js');
var controlTransportFactory = require('../../lib/transports/ControlTransportFactory.js');
var sinon = require('sinon');
var assert = require('assert');

var testTransport;

/**
 * Test transport used as mock for testing
 * @constructor
 */
function TestTransport() {
    ControlTransportApi.call(this);
}
TestTransport.prototype = Object.create(ControlTransportApi.prototype);

TestTransport.prototype.constructor = TestTransport;


TestTransport.prototype.connect = function (callback) {
    callback();
};

function TestTransportFactory() {
    ControlTransportFactorySpi.call(this, "test");
}

TestTransportFactory.prototype = Object.create(ControlTransportFactorySpi.prototype);

TestTransportFactory.prototype.constructor = TestTransportFactory;

TestTransportFactory.prototype.connect = function (url, callback) {
    testTransport.connect(url, callback);
    return testTransport;
};

controlTransportFactory.registerTransportFactorySpi(new TestTransportFactory());

/**
 * Tests
 */
describe("Control", function () {
    var control;
    var mock;

    beforeEach(function () {
        control = new K3poControl();
        testTransport = ControlTransportApi.prototype;
        mock = sinon.mock(testTransport);
    });

    afterEach(function () {
        mock.verify();
        mock.restore();
    });

    it("should load and connect via TestControlTransport", function (done) {

        var url = "test://localhost.com";

        mock.expects("connect").once().withArgs(url, done).callsArg(1);
        mock.expects("onMessage").once();

        control.connect(url, done);

    });

    it("should parse ERROR event", function (done) {
        var url = "test://localhost.com";
        var description = "description text";
        var summary = "summary text";
        var event = "ERROR\n" +
            "summary:" + summary + "\n" +
            "content-length:16\n" +
            "future-header:future-value\n" + // test forward compatibility
            "\n" + description;

        mock.expects("connect").once().returns(mock);
        mock.expects("onMessage").once().callsArgWith(0, event);

        control.connect(url, function () {
        });
        control.on("ERROR", function (event) {
            assert.equal(event.getType(), "ERROR");
            assert.equal(event.getDescription(), description);
            assert.equal(event.getSummary(), summary);
            done();
        });
    });

    it("should parse FINISHED event", function (done) {
        var url = "test://localhost.com";
        var script = "# comment";
        var event = "FINISHED\n" +
            "content-length:9\n" +
            "future-header:future-value\n" + // test forward compatibility
            "\n" + script;

        mock.expects("connect").once().returns(mock);
        mock.expects("onMessage").once().callsArgWith(0, event);

        control.connect(url, function () {
        });
        control.on("FINISHED", function (event) {
            assert.equal(event.getType(), "FINISHED");
            assert.equal(event.getScript(), script);
            done();
        });
    });

    it("should parse NOTIFIED event", function (done) {
        var url = "test://localhost.com";
        var barrier = "NOTIFYING_BARRIER";
        var event = "NOTIFIED\n" +
            "future-header:future-value\n" + // test forward compatibility
            "barrier:" + barrier + "\n" + // test forward compatibility
            "\n";

        mock.expects("connect").once().returns(mock);
        mock.expects("onMessage").once().callsArgWith(0, event);

        control.connect(url, function () {
        });
        control.on("NOTIFIED", function (event) {
            assert.equal(event.getType(), "NOTIFIED");
            assert.equal(event.getBarrier(), barrier);
            done();
        });
    });

    it("should parse PREPARED event", function (done) {
        var url = "test://localhost.com";
        var script = "# comment";
        var event = "PREPARED\n" +
            "content-length:9\n" +
            "future-header:future-value\n" + // test forward compatibility
            "\n" + script;

        mock.expects("connect").once().returns(mock);
        mock.expects("onMessage").once().callsArgWith(0, event);

        control.connect(url, function () {
        });
        control.on("PREPARED", function (event) {
            assert.equal(event.getType(), "PREPARED");
            assert.equal(event.getScript(), script);
            done();
        });
    });

    it("should parse STARTED event", function (done) {
        var url = "test://localhost.com";
        var event = "STARTED\n" + "future-header:future-value\n\n";

        mock.expects("connect").once().returns(mock);
        mock.expects("onMessage").once().callsArgWith(0, event);

        control.connect(url, function () {
        });
        control.addEventListener("STARTED", function (event) {
            assert.equal(event.getType(), "STARTED");
            done();
        });
    });

    it("should write ABORT command", function (done) {
        var url = "test://localhost.com";
        var cmd = new AbortCommand();

        mock.expects("connect").once().returns(mock);
        mock.expects("onMessage").once();
        mock.expects("write").once().withArgs("ABORT\n\n");
        mock.expects("flush").once().callsArg(0);

        control.connect(url, function () {
        });
        control.sendCommand(cmd, done);
    });

    it("should write AWAIT command", function (done) {
        var url = "test://localhost.com";
        var cmd = new AwaitCommand("myBarrier");

        mock.expects("connect").once().returns(mock);
        mock.expects("onMessage").once();
        mock.expects("write").once().withArgs("AWAIT\nbarrier:myBarrier\n\n");
        mock.expects("flush").once().callsArg(0);

        control.connect(url, function () {
        });
        control.sendCommand(cmd, done);
    });

    it("should write NOTIFY command", function (done) {
        var url = "test://localhost.com";
        var cmd = new NotifyCommand("myBarrier");

        mock.expects("connect").once().returns(mock);
        mock.expects("onMessage").once();
        mock.expects("write").once().withArgs("NOTIFY\nbarrier:myBarrier\n\n");
        mock.expects("flush").once().callsArg(0);

        control.connect(url, function () {
        });
        control.sendCommand(cmd, done);
    });

    it("should write PREPARE command", function (done) {
        var url = "test://localhost.com";
        var cmd = new PrepareCommand(["script"]);

        mock.expects("connect").once().returns(mock);
        mock.expects("onMessage").once();
        mock.expects("write").once().withArgs("PREPARE\nversion:2.0\nname:script\n\n");
        mock.expects("flush").once().callsArg(0);

        control.connect(url, function () {
        });
        control.sendCommand(cmd, done);
    });

    it("should write START command", function (done) {
        var url = "test://localhost.com";
        var cmd = new StartCommand();

        mock.expects("connect").once().returns(mock);
        mock.expects("onMessage").once();
        mock.expects("write").once().withArgs("START\n\n");
        mock.expects("flush").once().callsArg(0);

        control.connect(url, function () {
        });
        control.sendCommand(cmd, done);
    });

});

