var ScriptRunner = require("./ScriptRunner.js");

function ScriptRunnerBuilder() {
    this._url = "tcp://localhost:11642";
    this._root = "";
}

ScriptRunnerBuilder.prototype.scriptRoot = function (root) {
    this._root = root;
    return this;
};

ScriptRunnerBuilder.prototype.setUrl = function (url) {
    this._url = url;
    return this;
};

ScriptRunnerBuilder.prototype.build = function () {
    return new ScriptRunner(this._url, this._root);
};

module.exports = ScriptRunnerBuilder;