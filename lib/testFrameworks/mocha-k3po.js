var Mocha = require('mocha');
var Suite = require('mocha/lib/suite'),
    Test = require('mocha/lib/test');
var jsdiff = require('diff');

var BrowserRunnerConfig = require('./../browser/BrowserRunnerConfig.js');
var ScriptBuilder = require("../ScriptRunnerConfig.js");
var Control = require('../Control.js');
var assert = require('assert');
require('colors');


/**
 * This example is identical to the BDD interface, but with the addition of a
 * k3po functionality
 */
module.exports = Mocha.interfaces['mocha-k3po'] = function (suite) {
    var suites = [suite];
    var browserOptions = this.options.browser;
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
            context.browserConfig = new BrowserRunnerConfig().options(browserOptions);

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

            var suite = suites[0];

            if (suite.pending) {
                fn = null;
            }

            var test = new Test(title, function (done) {
                var browserRunner = this.test.browserRunner;
                var k3po = context.k3po = this.test.k3po;

                // TODO allow for scripts being in multiple args
                var scripts = title.split(",");
                for (var i = 0; i < scripts.length; i++) {
                    scripts[i] = scripts[i].trim();
                }

                k3po.prepare(scripts).then(function () {
                    browserRunner.proxy(fn, done, k3po);
                });
            });

            test.file = file;

            suite.addTest(test);
            return test;
        };

        suite.beforeAll(function (done) {
            this.timeout(0);
            context.browserConfig.init().then(function () {
                done();
            });
        });

        suite.beforeEach(function (done) {
            this.timeout(0);

            var k3po = this.currentTest.k3po = k3poConfig.build();
            var browserRunner = this.currentTest.browserRunner = browserConfig.build();
            this.currentTest.resultsGathered = false;
            var _currentTest = this.currentTest;

            k3po.on("FINISHED", function () {
                _currentTest.resultsGathered = true;
            });

            k3po.on("ERROR", function () {
                _currentTest.k3poError = true;
            });

            browserRunner.loadOrigin().then(function () {
                done();
            }, function (err) {
                throw err;
            });
        });

        suite.afterEach(function (done) {
            this.timeout(0);
            var _this = this;
            var k3po = this.currentTest.k3po;

            function assertResults() {
                try {
                    assert.equal(k3po.getExpected(), k3po.getActual());
                } catch (err) {
                    // Mocha peculiarity, conditional failing test in after is reported twice:
                    // https://github.com/mochajs/mocha/wiki/Conditionally-failing-tests-in-afterEach%28%29-hooks
                    // We only fail it if it didn't fail, other wise if it is already failing we print diff so they
                    // can see the cause
                    if (_this.currentTest.state === "passed") {
                        _this.test.error(err);
                    } else {
                        console.log(_this.currentTest.name + " SCRIPT DIFF");
                        var diff = jsdiff.diffLines(k3po.getExpected(), k3po.getActual());
                        diff.forEach(function (part) {
                            // green for additions, red for deletions
                            // grey for common parts
                            var color = part.added ? 'green' :
                                part.removed ? 'red' : 'grey';
                            console.log(part.value[color]);
                        });
                    }
                } finally {
                    if (_this.currentTest.browserRunner && _this.currentTest.browserRunner.getExceptions().length > 0) {
                        throw new Error(_this.currentTest.browserRunner.getExceptions()[0]);
                    }
                }
            }

            if (this.currentTest.k3poError) {
                try {
                    assert.ifError(k3po.getErrorSummary() + ": " + k3po.getErrorDescription() + "!");
                } catch (err) {
                    _this.test.error(err);
                } finally {
                    done();
                }
            } else if (!this.currentTest.resultsGathered) {
                var _doneFn = function () {
                    k3po.dispose().then(function () {
                        try {
                            assertResults();
                        } finally {
                            done();
                        }
                    });
                };
                k3po.on("ERROR", _doneFn);
                k3po.on("FINISHED", _doneFn);
                k3po.abort();
            } else {
                // TODO, perhaps call doneFn on callback, unclear if needed
                k3po.dispose();
                try {
                    assertResults();
                } finally {
                    done();
                }
            }
        });


        suite.afterAll(function (done) {
            // Set timeout for before to be long enough for webdriver to terminate
            this.timeout(0);
            context.browserConfig.terminate().then(function () {
                done();
            });
        });
    });
};