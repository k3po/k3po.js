var Mocha = require('mocha');
Suite = require('mocha/lib/suite'),
    Test = require('mocha/lib/test'),
    escapeRe = require('escape-string-regexp');

var K3poRunner = require('../../src/testFrameworks/K3poRunner.js');
var K3poControl = require('../../src/base/K3poControl.js').K3poControl;

var assert = require('assert');

/**
 * This example is identical to the BDD interface, but with the addition of a
 * k3po functionality
 */
module.exports = Mocha.interfaces['mocha-k3po'] = function (suite) {
    var suites = [suite];


    suite.on('pre-require', function (context, file, mocha) {
        var common = require('mocha/lib/interfaces/common')(suites, context);

        context.before = common.before;
        context.after = common.after;
        context.beforeEach = common.beforeEach;
        context.afterEach = function (name, fn) {
            common.afterEach(name, fn);
        };
        context.run = mocha.options.delay && common.runWithSuite(suite);
        var scripts = null;
        var k3poRunner;
        var scriptRoot;
        var postRun = [];

        context.setScriptRoot = function (root) {
            scriptRoot = root;
        };

        /**
         * Callback is optional, for usability
         * @param callback
         */
        context.k3poStart = function (callback) {
            k3poRunner.start(callback);
        };

        context.k3poFinish = function (callback) {
            // allowed to be called multiple times
            k3poRunner.start();
            if (callback) {
                postRun.push(callback);
            }

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
            var fn2 = function (done) {
                postRun.push(done);
                var k3poControl = new K3poControl();
                k3poControl.connect("tcp://localhost:11642", function () {
                    k3poRunner = new K3poRunner(k3poControl, function () {
                        var state = k3poRunner.getState();
                        if(state === "ERROR"){
                            assert.fail(k3poRunner.getErrorSummary() + ": " +k3poRunner.getErrorDescription());
                        }else if(state != "FINISHED"){

                        }
                        assert.equal(k3poRunner.getExpected(), k3poRunner.getActual());
                        while(postRun.length > 0){
                            postRun.pop()();
                        }
                    });
                    k3poRunner.setScriptRoot(scriptRoot);

                    var scripts = title.split(",");
                    for (var i = 0; i < scripts.length; i++) {
                        scripts[i] = scripts[i].trim();
                    }
                    k3poRunner.prepare(scripts, function () {
                        fn();
                    });
                });
            };
            after(title, function () {
                k3poRunner.dispose();
            });
            scripts = title;
            var suite = suites[0];
            if (suite.pending) {
                fn = null;
            }
            var test = new Test(title, fn2);
            test.file = file;
            suite.addTest(test);
            return test;
        };
    });
};