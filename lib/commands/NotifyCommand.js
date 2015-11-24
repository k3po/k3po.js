var Command = require("./Command.js");

/**
 * Notify k3po that a barrier has been triggered
 * @param barrier
 * @constructor
 */
function NotifyCommand(barrier) {
    Command.call(this, "NOTIFY");
    this.barrier = barrier;
}

NotifyCommand.prototype = Object.create(Command.prototype);

NotifyCommand.prototype.constructor = NotifyCommand;

NotifyCommand.prototype.getBarrier = function () {
    return this.barrier;
};

module.exports = NotifyCommand;