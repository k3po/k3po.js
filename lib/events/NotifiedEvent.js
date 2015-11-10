var Event = require("./Event.js");

/**
 * Notification that a barrier has been notified
 * @param barrier
 * @constructor
 */
function NotifiedEvent(barrier) {
    Event.call(this, "NOTIFIED");
    this.barrier = barrier;
}

NotifiedEvent.prototype = Object.create(Event.prototype);

NotifiedEvent.prototype.constructor = NotifiedEvent;

NotifiedEvent.prototype.getBarrier = function () {
    return this.barrier;
};

module.exports = NotifiedEvent;