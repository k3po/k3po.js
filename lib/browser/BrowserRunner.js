var webdriverio = require('webdriverio');
var RemoteScriptRunner = require('./RemoteScriptRunner.js');

function BrowserRunner(options, origin, resources) {
    this._options = options;
    this._origin = origin;
    this._resources = resources;
    this._browser = null;
}

BrowserRunner.prototype.terminate = function () {
    if (true) {
        return this._browser.end();
    } else {
        return new Promise(function (fulfill) {
            fulfill();
        });
    }
};

BrowserRunner.prototype.init = function () {
    this._browser = webdriverio
        .remote(this._options);
    return this._browser.init().timeoutsAsyncScript(0);
};

BrowserRunner.prototype.loadOrigin = function () {
    var k3po; // just here so doesn't show jshint errors,
    var _this = this;

    return _this._browser.execute(RemoteScriptRunner).execute(function (resources) {
        k3po = new RemoteScriptRunner(resources);
    }, _this._resources).then();
};

BrowserRunner.prototype.proxy = function (fn, done, k3po) {
    var _this = this;
    var toQueue = [];

    function executeLoop() {
        _this._browser.execute(function () {
            return k3po.nextCommand();
        }).then(function (ret) {
            if (ret.value != null) {
                try {
                    var command = JSON.parse(ret.value);
                    switch (command.type) {
                        case "AWAIT" :
                            var barrier = command.barrier;
                            k3po.await(barrier).then(function () {
                                toQueue.push('{ "type" : "NOTIFIED", "barrier" : "' + barrier + '"}');
                            });
                            break;
                        case "NOTIFY" :
                            var barrier = command.barrier;
                            k3po.notify(barrier);
                            break;
                        case "TEST_DONE" :
                            done();
                            return;
                        default:
                            throw "Unrecognized command type from browser: " + command.type;
                    }
                } catch (e) {
                    throw "Could not parse command from browser: " + e;
                }
            }
            if (toQueue.length > 0) {
                var event = toQueue.shift();
                _this._browser.execute(function (event) {
                    k3po.eventFired(event);
                    //send to Queue value;
                }, event).then(function () {
                    // don't want to get multiple queued execute's so need to do on on .then in this if
                    executeLoop();
                });
            } else {
                executeLoop();
            }
        });
    }

    var testDoneArgumentName = fn.toString().substring(fn.toString().indexOf("(") + 1, fn.toString().indexOf(")"));
    if (testDoneArgumentName !== "" && testDoneArgumentName !== "done") {
        // TODO, seems like we should be able to work around this, but haven't yet found universal way in all browsers
        // to eval/create a function with a dynamic name and assign as global
        throw 'Done callback argument for test must have name "done"';
    }

    // remove done parameter in function as have not found a way to pass in what we need here, done is then
    // correctly globably defined to be k3po.testDone();
    var body = fn.toString().substring(fn.toString().indexOf("{") + 1, fn.toString().lastIndexOf("}"));
    var newFn = new Function("testFunction", body);

    _this._browser.execute(function () {
        done = function () {
            k3po.testDone();
        };
    }).then(function () {
        _this._browser.execute(newFn).then(executeLoop);
    });

    k3po.on("STARTED", function () {
        toQueue.push('{ "type" : "STARTED"}');
    });
    k3po.on("FINISHED", function () {
        toQueue.push('{ "type" : "FINISHED"}');
    });
};

module.exports = BrowserRunner;