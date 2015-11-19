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

        beforeEach(function (done) {
            browserConfig.build().loadOrigin().then(function () {
                done();
            }, function(err){
                throw err;
            });

        });

        /**
         * Describe a specification or test-case
         * with the given `title` and callback `fn`
         * acting as a thunk.
         */
        context.it = context.specify = function (title, fn) {

            // create k3po per test
            var k3po = context.k3po = k3poConfig.build();
            var browserRunner = browserConfig.build();

            var k3poResultsGathered = false;
            var inAfterTest = false;

            var internalTest = function (testComplete) {
                var getResults = function (doneWithResults) {
                    if (!k3poResultsGathered) {
                        var _doneFn = function () {
                            k3po.dispose();
                            doneWithResults();
                        };
                        k3po.on("ERROR", _doneFn);
                        k3po.on("FINISHED", _doneFn);
                        k3po.abort();
                    } else {
                        // TODO, perhaps call doneFn on callback, unclear if needed
                        k3po.dispose();
                        doneWithResults();
                    }
                };

                k3po.on("FINISHED", function () {
                    k3poResultsGathered = true;
                    if (inAfterTest) {
                        var diff = jsdiff.diffLines(k3po.getExpected(), k3po.getActual());
                        diff.forEach(function (part) {
                            // green for additions, red for deletions
                            // grey for common parts
                            var color = part.added ? 'green' :
                                part.removed ? 'red' : 'grey';
                            console.log(part.value[color]);
                        });
                    } else {
                        assert.equal(k3po.getExpected(), k3po.getActual());
                    }
                });
                k3po.on("ERROR", function () {
                    k3poResultsGathered = true;
                    assert.ifError(k3po.getErrorSummary() + ": " + k3po.getErrorDescription() + "!");
                });
                k3po.on("PREPARED", function () {
                    browserRunner.run(fn).then(function () {
                        getResults(testComplete);
                    });
                });

                // Case to handle timeout
                afterEach(function (afterDone) {
                    inAfterTest = true;
                    if (!k3poResultsGathered) {
                        getResults(afterDone);
                    } else {
                        afterDone();
                    }
                });

                // TODO allow for scripts being in multiple args
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
            this.timeout(10000);
            context.browserConfig.init().then(function () {
                done();
            });
        });

        after(function (done) {
            // Set timeout for before to be long enough for webdriver to terminate
            this.timeout(10000);
            context.browserConfig.terminate().then(function () {
                done();
            });
        });
    });
};