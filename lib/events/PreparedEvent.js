var Event = require("./Event.js");

/**
 * Notification that the script is prepared
 * @param script
 * @constructor
 */
function PreparedEvent(script) {
    Event.call(this, "PREPARED");
    this.script = script;
}

PreparedEvent.prototype = Object.create(Event.prototype);

PreparedEvent.prototype.constructor = PreparedEvent;

PreparedEvent.prototype.getScript = function () {
    return this.script;
};

module.exports = PreparedEvent;
