'use strict';

var K3poControl = require('../src/base/K3poControl.js');
var TestTransport = require('../test/TestTransport.js');

describe("K3poControl", function () {
    var control;

    beforeEach(function () {
        console.log("test://localhost");
        control = new K3poControl("test://localhost.com");
    });

    it("should load TestControlTransport", function (done) {
        // TODO
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

