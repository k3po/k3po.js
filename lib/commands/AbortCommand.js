var Command = require("./Command.js");

/**
 * Aborts the script execution
 * @constructor
 */
function AbortCommand() {
    Command.call(this, "ABORT");
}

AbortCommand.prototype = Object.create(Command.prototype);

AbortCommand.prototype.constructor = AbortCommand;

module.exports = AbortCommand;
