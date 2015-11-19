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
    return this._browser.init().timeoutsAsyncScript(50000);
};

BrowserRunner.prototype.loadOrigin = function () {
    var k3po; // just here so doesn't show jshint errors,
    var _this = this;

    return new Promise(function (fulfill) {
        _this._browser.execute(RemoteScriptRunner).then(function () {
            _this._browser.execute(function (resources) {
                k3po = new RemoteScriptRunner(resources);
            }, _this._resources).then(function () {
                fulfill();
            });
        });
    });
};

BrowserRunner.prototype.run = function (fn) {
    var _this = this;
    return new Promise(function (fulfill, reject) {
        try {
            _this._browser.executeAsync(fn).then(function () {
                fulfill();
            }, function (ret) {
                console.error(ret);
                reject(ret);
            });
        } catch (e) {
            console.log("Exception thrown in remote browser: " + e);
            reject(e);
        }
    });
};

module.exports = BrowserRunner;
