'use strict';

var TcpK3poControl = require('../src/TcpK3poControl.js');

/**
 * K3poAssert is a generic assert that can be subclassed for specific testing frameworks
 * @param args is json allowing 'scripts', 'host', 'port', 'verbose', 'timeout'
 * @param callback
 * @constructor
 * @param onError function(errorMsg) called when there is an error
 * @param onAssert function(expectedScript, actualScript) called when asserted
 */
function K3poTestRunner(args, callback, onError, onAssert) {
    var scriptNames = args['scripts'];
    var host = args['host'];
    var port = args['port'];
    var verbose = args['verbose'];
    this.timeout = args['timeout'];
    this.verbose = false;
    if (verbose) {
        this.verbose = true;
    }
    this.onAssert = onAssert;
    this.state = null;
    this.expectedScript = null;

    if (!host) {
        host = "localhost";
    }
    if (!port) {
        port = 11642;
    }
    if (verbose) {
        console.log("K3poTestRunner host: " + host + ", port: " + port);
    }

    var control = new TcpK3poControl(host, port);

    var _this = this;

    control.onPrepared = function (script) {
        if (verbose) {
            console.log("K3poTestRunner Prepared: " + script);
        }
        _this.expectedScript = script;
        callback();
    };

    control.onError = onError;

    if (verbose) {
        console.log("K3poTestRunner Prepare: " + scriptNames);
    }
    control.prepare(scriptNames);
    this.control = control;
}

/**
 * Waits for the robot to finish and calls assert with expected and observed script
 *
 */
K3poTestRunner.prototype.finish = function (callback) {
    var timeout;
    var _this = this;
    if (this.timeout) {
        timeout = setTimeout(function () {
            timeout = null;
            _this.control.abort();
        }, this.timeout);
    }

    if (this.verbose) {
        console.log("K3poTestRunner Start");
    }
    this.control.onFinished = function (observedScript) {
        if (timeout) {
            clearTimeout(timeout);
        }
        _this.onAssert(_this.expectedScript, observedScript);
        if (callback) {
            callback();
        }
    };
    this.control.start();
};

module.exports = K3poTestRunner;
