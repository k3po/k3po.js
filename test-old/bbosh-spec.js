'use strict';

var assert = require("assert");
var K3poTest = require('../src/K3poTest.js');
var cnt = 0;
var debug = true;
// TODO look into mocha debugging

describe("Bbbosh in browser tests", function () {
    var webdriver = require('selenium-webdriver');
    var baseurl = "http://localhost:8080/bbosh-test.html";

    var driver;

    // start webdriver
    before(function (done) {
        if(debug){
            console.log("Starting Webdriver");
        }
        driver = new webdriver.Builder().
            withCapabilities(webdriver.Capabilities.chrome()).
            build();

        var promise = driver.get(baseurl);
        promise.then(done, assert.ifError);
    });

    // stop webdriver
    after(function () {
        if(debug){
            console.log("Stopping Webdriver");
        }
        // TODO Why driver doesn't exit
        driver.quit();
    });

    // Setup Robot
    var k3poTest;
    beforeEach(function (done) {
        var onError = function (errorMsg) {
            assert.ifError(errorMsg);
        };
        var onAssert = function (expected, actual) {
            if(cnt === 0){
//                assert.equal(expected, actual, "Observed and expected scripts dont match: \nexpected: " + expected + " \n\n " + "actual:" + actual);
                assert.equal(expected, actual, "Cnt" + cnt);
            }
        };
        k3poTest = new K3poTest(onError, onAssert, {"timeout": 1000});

        // refresh webdriver
        var promise = driver.navigate().refresh();
        promise.then(done, assert.ifError);
    });

    // Test
    it("test connect yeah yeah", function (done) {
            k3poTest.test(
                ["org/kaazing/robotic/bbosh/streaming/accept.echo.then.close"],
                function () {
                    k3poTest.finish(done);
                }
            );
        }
    );
});
