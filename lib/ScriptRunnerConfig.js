var ScriptRunner = require("./ScriptRunner.js");

function ScriptRunnerConfig() {
    this._url = "tcp://localhost:11642";
    this._root = "";
}

ScriptRunnerConfig.prototype.scriptRoot = function (root) {
    this._root = root;
    return this;
};

ScriptRunnerConfig.prototype.setUrl = function (url) {
    this._url = url;
    return this;
};

ScriptRunnerConfig.prototype.build = function () {
    return new ScriptRunner(this._url, this._root);
};

module.exports = ScriptRunnerConfig;