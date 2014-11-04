'use strict';

var K3poTestRunner = require('../src/K3poTestRunner.js');

/**
 * Constructor of K3poAssert object
 * @param test is the nodeunit test
 * @param args is json allowing 'scripts', 'host', 'port', 'verbose'
 * @param callback
 * @constructor
 */
function K3poAssert(test, args, callback) {
    var onError = function (errorMsg) {
        test.fail(errorMsg);
    };

    var onAssert = function (expected, actual) {
        test.equal(expected, actual);
    };

    this.runner = new K3poTestRunner(args, callback, onError, onAssert);
}

/**
 * Runs the test and will call an assert that observed scripts == expected
 * @param callback
 */
K3poAssert.prototype.assert = function (callback) {
    this.runner.start(callback);
};

module.exports = K3poAssert;