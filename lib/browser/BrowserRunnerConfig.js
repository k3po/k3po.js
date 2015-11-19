var BrowserRunner = require("./BrowserRunner.js");
var NoopBrowserRunner = require("./NoopBrowserRunner.js");

function BrowserRunnerConfig() {
    this._origin = "http://localhost:8080";
    this._options = null;
    this._browserRunner = null;
    this._resources = [
        // These are needed for RemoteScriptRunner
        "https://www.promisejs.org/polyfills/promise-6.1.0.js",
        "https://cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.min.js"
    ];
}

BrowserRunnerConfig.prototype.options = function (options) {
    this._options = options;
    return this;
};

BrowserRunnerConfig.prototype.origin = function (origin) {
    this._origin = origin;
    return this;
};

BrowserRunnerConfig.prototype.addResource = function (resource) {
    this._resources.push(resource);
    return this;
};

BrowserRunnerConfig.prototype.build = function () {
    if (!this._browserRunner) {
        if (this._options == null) {
            this._browserRunner = new NoopBrowserRunner();
        } else {
            this._browserRunner = new BrowserRunner(this._options, this._origin, this._resources);
        }
    }
    return this._browserRunner;
};

BrowserRunnerConfig.prototype.init = function () {
    return this.build().init();
};

BrowserRunnerConfig.prototype.terminate = function () {
    return this._browserRunner.terminate();
};

module.exports = BrowserRunnerConfig;