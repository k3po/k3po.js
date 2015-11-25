var Command = require("./Command.js");

/**
 * Prepares the driver for running
 * @param scripts
 * @constructor
 */
function PrepareCommand(scripts, origin) {
    Command.call(this, "PREPARE");

    if (origin && origin !== "") {
        this.origin = origin;
    }

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

PrepareCommand.prototype.getOrigin = function () {
    return this.origin;
};

module.exports = PrepareCommand;