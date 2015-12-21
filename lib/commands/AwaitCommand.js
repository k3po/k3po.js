var Command = require("./Command.js");

/**
 * Awaits the barrier
 * @param barrier
 * @constructor
 */
function AwaitCommand(barrier) {
    Command.call(this, "AWAIT");
    this.barrier = barrier;
}

AwaitCommand.prototype = Object.create(Command.prototype);

AwaitCommand.prototype.constructor = AwaitCommand;

AwaitCommand.prototype.getBarrier = function () {
    return this.barrier;
};

module.exports = AwaitCommand;
