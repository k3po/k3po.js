var Mocha = require('mocha');
Suite = require('mocha/lib/suite'),
    Test = require('mocha/lib/test'),
    escapeRe = require('escape-string-regexp');

var k3poControl = require('../../src/base/K3poControl.js'),
    K3poControl = k3poControl.K3poControl,
    AbortCommand = k3poControl.AbortCommand,
    AwaitCommand = k3poControl.AwaitCommand,
    NotifyCommand = k3poControl.NotifyCommand,
    PrepareCommand = k3poControl.PrepareCommand,
    StartCommand = k3poControl.StartCommand;

/**
 * This example is identical to the BDD interface, but with the addition of a
 * k3po functionality
 */
module.exports = Mocha.interfaces['mocha-k3po'] = function (suite) {
    var suites = [suite];

    function K3poRunner(k3poControl) {
        this.state = "INITIAL"; // INITIAL, START, STARTED
        this.k3poControl = k3poControl;
    }

    K3poRunner.prototype.changeState = function (newState) {
        switch (this.state) {
            case "INITIAL":
                switch (newState) {
                    case "PREPARE":
                    //k3poControl.
                    //break;
                    default:
                        throw "Cannot go from state " + this.state + " to state new state " + newState;
                }
                break;
            default:
                throw "K3poRunner, Unrecognized current state " + this.state;
        }
        this.state = newState;
    };

    K3poRunner.prototype.handlePrepared= function(callback){
        switch (this.state) {
            case "PREPARE":
                this.state = "PREPARED";
                callback();
                break;
            default:
                throw "Can not call handlePrepared from state: " + this.state;
        }
    };

    K3poRunner.prototype.prepare = function(scripts, callback){
        var cmd = new PrepareCommand(scripts);
        switch (this.state) {
            case "INITIAL":
                this.state = "PREPARE";
                this.k3poControl.sendCommand(cmd, function(){
                    this.k3poControl.on("PREPARED", this.handlePrepared(callback));
                });
                break;
            default:
                throw "Can not call prepare from state: " + this.state;
        }
    };

    K3poRunner.prototype.start = function (callback) {

    };

    suite.on('pre-require', function (context, file, mocha) {
        var common = require('mocha/lib/interfaces/common')(suites, context);

        context.before = common.before;
        context.after = common.after;
        context.beforeEach = common.beforeEach;
        context.afterEach = common.afterEach;
        context.run = mocha.options.delay && common.runWithSuite(suite);
        var scripts = null;
        var k3poRunner;
        var scriptRoot;

        context.setScriptRoot = function (root) {
            scriptRoot = root;
        };

        context.k3poStart = function (callback) {
            if (callback == null) {
                callback = function () {
                };
            }
            k3poRunner.start(callback);
        };

        context.k3poFinish = function () {
            if (!started) {
                console.log("TODO: Send K3po Start from k3poFinish()");
            }
            console.log("TODO: Send K3po Finish");
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
            k3poRunner = new K3poRunner();
            var fn2 = function (done) {
                var k3poControl = new K3poControl();
                k3poControl.connect("tcp://localhost:61616", function () {
                    k3poRunner = new K3poRunner(k3poControl);

                    var scripts = title.split(",");
                    for(var i = 0; i <scripts.length; i++){
                        scripts[i] = scripts[i].trim();
                    }
                    k3poRunner.prepare(scripts, function () {
                        fn(done);
                    });
                });
            };
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