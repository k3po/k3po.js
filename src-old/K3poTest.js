'use strict';

var K3poTestRunner = require('../src/K3poTestRunner.js');
var assert = require("assert");

function K3poTest(onError, onAssert, args) {
    this.runner = null;
    if (!onError) {
        this.onError = function (errorMsg) {
            assert.ifError(errorMsg);
        };
    } else {
        this.onError = onError;
    }
    if (!onAssert) {
        this.onAssert = function (expected, actual) {
            assert.equal(expected, actual, "Observed and expected scripts are the same");
        };
    } else {
        this.onAssert = onAssert;

    }
    if (!args) {
        args = {};
    }
    this.args = args;
}

K3poTest.prototype.test = function (args, callback) {
    if (args) {
        // TODO, concat args which are json
        // if (this.args){
        // this.args = this.args.concat(this.args)
        // } else {
        // this.args = args
        // }
    }

    if(!args){
        // could throw a helpful error message here "like no properties set on robot", though
        // I'm not sure how I want to do the logging
    }
    this.runner = new K3poTestRunner(this.args, callback, this.onError, this.onAssert);
};

K3poTest.prototype.finish = function (callback) {
    this.runner.finish(callback);
};

module.exports = K3poTest;

module.exports = K3poTest;