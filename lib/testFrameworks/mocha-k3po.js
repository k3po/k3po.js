var Mocha = require('mocha');
var Suite = require('mocha/lib/suite'),
    Test = require('mocha/lib/test');

var K3poRunner = require('../K3poRunner.js');
var BrowserRunner = require('./BrowserRunner.js');
var K3poControl = require('../K3poControl.js');
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

        var k3poRunner;
        var scriptRoot;
        var disposed = true;
        var origin = null;

        context.setScriptRoot = function (root) {
            scriptRoot = root;
        };

        /**
         * Callback is optional, for usability
         * @param callback
         */
        context.k3poStart = function k3poStart(callback) {
            if (callback) {
                k3poRunner.on("STARTED", callback);
            }
            k3poRunner.start();
        };

        context.k3poFinish = function k3poFinish(callback) {
            k3poRunner.start();
            if (callback) {
                k3poRunner.on("FINISHED", callback);
            }
        };

        context.setOrigin = function (orig) {
            origin = orig;
        };

        /**
         * Describe a "suite" with the given `title`
         * and callback `fn` containing nested suites
         * and/or tests.
         */
        context.describe = context.context = function (title, fn) {
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
            if (browserRunner.isEnabled()) {
                var proxyMethodMap = [k3poStart, k3poFinish];
                fn = proxy(proxyMethodMap, fn, browserRunner);
            }

            var done = false;

            // TODO allow for multiple arrays
            var internalTest = function (doneFn) {

                var k3poControl = new K3poControl();
                disposed = false;
                k3poControl.connect("tcp://localhost:11642", function () {
                    k3poRunner = new K3poRunner(k3poControl);
                    k3poRunner.on("FINISHED", function () {
                        done = true;
                        assert.equal(k3poRunner.getExpected(), k3poRunner.getActual());
                        doneFn();
                    });
                    k3poRunner.on("ERROR", function () {
                        done = true;
                        assert.ifError(k3poRunner.getErrorSummary() + ": " + k3poRunner.getErrorDescription() + "!");
                        doneFn();
                    });
                    k3poRunner.on("PREPARED", fn);
                    k3poRunner.setScriptRoot(scriptRoot);
                    var scripts = title.split(",");
                    for (var i = 0; i < scripts.length; i++) {
                        scripts[i] = scripts[i].trim();
                    }
                    k3poRunner.prepare(scripts);
                });
            };

            afterEach(title, function (doneFn) {
                if (!disposed) {
                    if (!done) {
                        var _doneFn = function () {
                            k3poRunner.dispose();
                            disposed = true;
                            doneFn();
                        };
                        k3poRunner.on("ERROR", _doneFn);
                        k3poRunner.on("FINISHED", _doneFn);
                        k3poRunner.abort();
                    } else {
                        // TODO, perhaps call doneFn on callback, unclear if needed
                        k3poRunner.dispose();
                        disposed = true;
                        doneFn();
                    }
                } else {
                    doneFn();
                }
            });


            var suite = suites[0];
            if (suite.pending) {
                fn = null;
            }
            var test = new Test(title, internalTest);
            test.file = file;
            suite.addTest(test);
            return test;
        };

        context.notifyBarrier = function notifyBarrier(barrierName) {
            k3poRunner.notifyBarrier(barrierName);
        };

        context.awaitBarrier = function awaitBarrier(barrierName, callback) {
            k3poRunner.awaitBarrier(barrierName, callback);
        };

        before(function (done) {
            // Set timeout for before to be long enough for webdriver to boot
            this.timeout(10000);
            browserRunner.init(origin, done);
        });

        after(function (done) {
            // Set timeout for before to be long enough for webdriver to terminate
            this.timeout(10000);
            browserRunner.terminate(done);
        });
    });
};