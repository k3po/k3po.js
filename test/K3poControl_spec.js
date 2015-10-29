'use strict';

require('../test/TestTransportFactory.js');
var K3poControl = require('../src/base/K3poControl.js');

describe("K3poControl", function () {
    var control;

    beforeEach(function () {
        console.log("test://localhost");
        control = new K3poControl();
    });

    it("should load TestControlTransport", function (done) {
        control.connect("test://localhost.com", null);
        done();
    });

    it("should parse ERROR event", function (done) {
        // TODO
        done();
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

    it("should parse write ABORT command", function (done) {
        // TODO
        done();
    });

    it("should parse write AWAIT command", function (done) {
        // TODO
        done();
    });

    it("should parse write NOTIFY command", function (done) {
        // TODO
        done();
    });

    it("should parse write PREPARE command", function (done) {
        // TODO
        done();
    });

    it("should parse write START command", function (done) {
        // TODO
        done();
    });

});

