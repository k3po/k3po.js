var Command = require("./Command.js");

/**
 * Prepares the driver for running
 * @param scripts
 * @constructor
 */
function PrepareCommand(scripts) {
    Command.call(this, "PREPARE");

    if (scripts != null && scripts.constructor === Array) {
        this.scripts = scripts;
    } else {
        throw "Invalid argument, scripts is not an Array";
    }
}

PrepareCommand.prototype = Object.create(Command.prototype);

PrepareCommand.prototype.constructor = PrepareCommand;

PrepareCommand.prototype.getScripts = function () {
    return this.scripts;
};

module.exports = PrepareCommand;