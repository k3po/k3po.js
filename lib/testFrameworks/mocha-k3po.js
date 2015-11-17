var Mocha = require('mocha');
var Suite = require('mocha/lib/suite'),
    Test = require('mocha/lib/test');

var ScriptBuilder = require("../ScriptRunnerBuilder.js");
var BrowserRunner = require('./../BrowserRunner.js');
var Control = require('../Control.js');
var proxy = require('./proxy.js');

var assert = require('assert');


/**
 * This example is identical to the BDD interface, but with the addition of a
 * k3po functionality
 */
module.exports = Mocha.interfaces['mocha-k3po'] = function (suite) {
    var suites = [suite];
    var browserRunner = new BrowserRunner(this.options.browser);

    suite.on('pre-require', function (context, file, mocha) {
        var common = require('mocha/lib/interfaces/common')(suites, context);

        context.before = common.before;
        context.after = common.after;
        context.beforeEach = common.beforeEach;
        context.afterEach = common.afterEach;
        context.run = mocha.options.delay && common.runWithSuite(suite);

        /**
         * Describe a "suite" with the given `title`
         * and callback `fn` containing nested suites
         * and/or tests.
         */
        context.describe = context.context = function (title, fn) {

            // init k3poBuilder per each describe
            context.k3poConfig = new ScriptBuilder();

            // default code
            var suite = Suite.create(suites[0], title);
            suite.file = file;
            suites.unshift(suite);
            fn.call(suite);
            suites.shift();
            return suite;
        };

        /**
         * Describe a specification or test-case
         * with the given `title` and callback `fn`
         * acting as a thunk.
         */
        context.it = context.specify = function (title, fn) {

            // create k3po per test
            var k3po = context.k3po = k3poConfig.build();


            if (browserRunner.isEnabled()) {
                // todo
            }

            var done = false;

            // TODO allow for multiple arrays
            var internalTest = function (doneFn) {
                k3po.on("FINISHED", function () {
                    done = true;
                    assert.equal(k3po.getExpected(), k3po.getActual());
                });
                k3po.on("ERROR", function () {
                    done = true;
                    assert.ifError(k3po.getErrorSummary() + ": " + k3po.getErrorDescription() + "!");
                });
                k3po.on("PREPARED", function () {
                    fn(function () {
                        if (!done) {
                            var _doneFn = function () {
                                k3po.dispose();
                                doneFn();
                            };
                            k3po.on("ERROR", _doneFn);
                            k3po.on("FINISHED", _doneFn);
                            k3po.abort();
                        } else {
                            // TODO, perhaps call doneFn on callback, unclear if needed
                            k3po.dispose();
                            doneFn();
                        }

                    });
                });
                var scripts = title.split(",");
                for (var i = 0; i < scripts.length; i++) {
                    scripts[i] = scripts[i].trim();
                }
                k3po.prepare(scripts);
            };


            var suite = suites[0];
            if (suite.pending) {
                fn = null;
            }
            var test = new Test(title, internalTest);
            test.file = file;
            suite.addTest(test);
            return test;
        };

        before(function (done) {
            // Set timeout for before to be long enough for webdriver to boot
            if (browserRunner.isEnabled()) {
                //this.timeout(10000);
                //browserRunner.init(origin, done);
            } else {
                done();
            }
        });

        after(function (done) {
            // Set timeout for before to be long enough for webdriver to terminate
            //this.timeout(10000);
            browserRunner.terminate(done);
        });
    });
};