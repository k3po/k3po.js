'use strict';

var k3poControl = require('../src/base/K3poControl.js'),
    K3poControl = k3poControl.K3poControl,
    AbortCommand = k3poControl.AbortCommand,
    AwaitCommand = k3poControl.AwaitCommand,
    PrepareCommand = k3poControl.PrepareCommand,
    StartCommand = k3poControl.StartCommand;
var ControlTransportApi = require('../src/base/ControlTransportApi.js').ControlTransportApi;
var ControlTransportFactorySpi = require('../src/base/ControlTransportFactorySpi.js').ControlTransportFactorySpi;
var controlTransportFactory = require('../src/base/ControlTransportFactory.js');
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
describe("K3poControl", function () {
    var control;
    var mock;

    beforeEach(function () {
        console.log("test://localhost");
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

        control.connect(url, done);

    });

    it("should parse ERROR event", function (done) {
        var url = "test://localhost.com";
        var description = "description text";
        var summary = "summary text";
        var errorEvent = "ERROR\n" +
            "summary:" + summary + "\n" +
            "content-length:16\n" +
            "future-header:future-value\n" + // test forward compatibility
            "\n" + description;

        mock.expects("connect").once().returns(mock);
        mock.expects("read").once().callsArgWith(0, errorEvent);

        control.connect(url, function () {
        });
        control.readEvent(function (event) {
            assert.equal(event.getType(), "ERROR");
            assert.equal(event.getDescription(), description);
            assert.equal(event.getSummary(), summary);
            done();
        });

    });

    it("should parse FINISHED event", function (done) {
        // TODO
        done();
    });

    it("should parse NOTIFIED event", function (done) {
        // TODO
        done();
    });

    it("should parse STARTED event", function (done) {
        // TODO
        done();
    });

    it("should write ABORT command", function (done) {
        var url = "test://localhost.com";
        var description = "description text";
        var summary = "summary text";
        var abortCommand = new AbortCommand();

        mock.expects("connect").once().returns(mock);
        mock.expects("write").once().withArgs("ABORT\n\n");
        mock.expects("flush").once().callsArg(0);

        control.connect(url, function () {
        });
        control.sendCommand(abortCommand, done);
    });

    it("should write AWAIT command", function (done) {
        // TODO
        done();
    });

    it("should write NOTIFY command", function (done) {
        // TODO
        done();
    });

    it("should write PREPARE command", function (done) {
        // TODO
        done();
    });

    it("should write START command", function (done) {
        // TODO
        done();
    });

});

