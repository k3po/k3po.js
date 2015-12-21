var Event = require("./Event.js");

/**
 * Notification that the script has started
 * @constructor
 */
function StartedEvent() {
    Event.call(this, "STARTED");
}

StartedEvent.prototype = Object.create(Event.prototype);

StartedEvent.prototype.constructor = StartedEvent;

module.exports = StartedEvent;
