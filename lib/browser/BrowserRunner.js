var webdriverio = require('webdriverio');
var RemoteScriptRunner = require('./RemoteScriptRunner.js');

function BrowserRunner(options, origin, resources) {
    this._options = options;
    this._origin = origin;
    this._resources = resources;
    this._browser = null;
}

BrowserRunner.prototype.terminate = function () {
    if (false) {
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
                console.log("read command: " + ret.value);
                // process value

                if (ret.value === "TEST_DONE\n\n") {
                    done();
                    return;
                }
            }
            if (toQueue.length > 0) {
                _this._browser.execute(function () {
                    //send to Queue value;
                }).then(function () {
                    // don't want to get multiple queued execute's so need to do on then
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
        // to eval a function with a dynamic name and assign as global
        throw "Done callback argument for test must have name 'done";
    }

    var body = fn.toString().substring(fn.toString().indexOf("{") + 1, fn.toString().lastIndexOf("}"));
    var newFn = new Function("testFunction", body);

    // Todo, in future we should support dynamic done function names

    _this._browser.execute(function () {
        done = function () {
            k3po.testDone();
        };
        console.log("hmmm " + done);
    }).then(function () {
        _this._browser.execute(newFn).then(executeLoop);
    });

    function notifyEvent(type) {
        console.log("notify event " + type);
        _this._browser.execute(function (type) {
            console.log("proxy event: start: " + type);
            k3po.eventFired(type, null);
            console.log("proxy event: finished: " + type);
        }, type);

    }

    k3po.on("STARTED", function () {
        toQueue.push("STARTED");
    });
    k3po.on("FINISHED", function () {
        toQueue.push("STARTED");
    });
};

module.exports = BrowserRunner;
