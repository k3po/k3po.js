var Mocha = require('mocha');
Suite = require('mocha/lib/suite'),
    Test = require('mocha/lib/test'),
    escapeRe = require('escape-string-regexp');

/**
 * This example is identical to the TDD interface, but with the addition of a
 * k3po functionality
 */
module.exports = Mocha.interfaces['example-ui'] = function (suite) {
    var suites = [suite];

    suite.on('pre-require', function (context, file, mocha) {
        var common = require('mocha/lib/interfaces/common')(suites, context);

        /**
         * Use all existing hook logic common to UIs. Common logic can be found in
         * https://github.com/mochajs/mocha/blob/master/lib/interfaces/common.js
         */
        context.setup = common.beforeEach;
        context.teardown = common.afterEach;
        context.suiteSetup = common.before;
        context.suiteTeardown = common.after;
        context.run = mocha.options.delay && common.runWithSuite(suite);

        /**
         * The default TDD suite functionality. Describes a suite with the
         * given title and callback, fn`, which may contain nested suites
         * and/or tests.
         */
        context.suite = function (title, fn) {
            var suite = Suite.create(suites[0], title);

            suite.file = file;
            suites.unshift(suite);
            fn.call(suite);
            suites.shift();

            return suite;
        };

        /**
         * The default TDD pending suite functionality.
         */
        context.suite.skip = function (title, fn) {
            var suite = Suite.create(suites[0], title);

            suite.pending = true;
            suites.unshift(suite);
            fn.call(suite);
            suites.shift();
        };

        /**
         * Default TDD exclusive test-case logic.
         */
        context.suite.only = function (title, fn) {
            var suite = context.suite(title, fn);
            mocha.grep(suite.fullTitle());
        };

        /**
         * Default TDD test-case logic. Describes a specification or test-case
         * with the given `title` and callback `fn` acting as a thunk.
         */
        context.test = function (title, fn) {
            var suite, test;

            suite = suites[0];
            if (suite.pending) fn = null;
            test = new Test(title, fn);
            test.file = file;
            suite.addTest(test);

            return test;
        };

        /**
         * Exclusive test-case.
         */
        context.test.only = function (title, fn) {
            var test, reString;

            test = context.test(title, fn);
            reString = '^' + escapeRe(test.fullTitle()) + '$';
            mocha.grep(new RegExp(reString));
        };

        /**
         * Defines the skip behavior for a test.
         */
        context.test.skip = common.test.skip;
    });
};
