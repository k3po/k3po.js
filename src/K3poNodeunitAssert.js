'use strict';

var TcpK3poControl = require('../src/TcpK3poControl.js');

/**
 * Constructor of K3poAssert object
 * @param test is the nodeunit test
 * @param args is json allowing 'scripts', 'host', 'port', 'verbose'
 * @param callback
 * @constructor
 */
function K3poAssert(test, args, callback) {
    var scriptNames = args['scripts'];
    var host = args['host'];
    var port = args['port'];
    var verbose = args['verbose'];
    this.verbose = false;
    if(verbose){
        this.verbose = true;
    }
    this.test = test;

    this.state = null;
    this.expectedScript = null;

    if (!host) {
        host = "localhost";
    }
    if (!port) {
        port = 11642;
    }
    if(verbose){
        console.log("K3poAssert host: " + host + ", port: " + port);
    }

    var control = new TcpK3poControl(host, port);

    var _this = this;

    control.onPrepared = function (script) {
        if(verbose){
            console.log("K3poAssert Prepared: " + script);
        }
        _this.expectedScript = script;
        callback();
    };

    control.onError = function (errorMsg) {
        if(verbose){
            console.log("K3poAssert Error: " + errorMsg);
        }
        _this.test.fail(errorMsg);
        test.done();
    };

    if(verbose){
        console.log("K3poAssert Prepare: " + scriptNames);
    }
    control.prepare(scriptNames);
    this.control = control;
}

/**
 * Runs the test and will call an assert that observed scripts == expected
 * @param callback
 */
K3poAssert.prototype.assert = function (callback) {
    if(this.verbose){
        console.log("K3poAssert Start");
    }
    var _this = this;
    this.control.onFinished = function (observedScript) {
        _this.test.equal(_this.expectedScript, observedScript);
        callback();
    };
    this.control.start();
};

module.exports = K3poAssert;