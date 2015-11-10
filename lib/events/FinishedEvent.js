var Event = require("./Event.js");

/**
 * When script execution has finished
 * @param script
 * @constructor
 */
function FinishedEvent(script) {
    Event.call(this, "FINISHED");
    this.script = script;
}

FinishedEvent.prototype = Object.create(Event.prototype);

FinishedEvent.prototype.constructor = FinishedEvent;

FinishedEvent.prototype.getScript = function () {
    return this.script;
};

module.exports = FinishedEvent;