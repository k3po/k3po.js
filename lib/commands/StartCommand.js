var Command = require("./Command.js");

/**
 * Starts the script execution
 * @constructor
 */
function StartCommand() {
    Command.call(this, "START");
}

StartCommand.prototype = Object.create(Command.prototype);

StartCommand.prototype.constructor = StartCommand;


module.exports = StartCommand;