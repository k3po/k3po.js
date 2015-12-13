/**
 * Event is an abstract class that represents a K3po Event
 * @constructor
 */
function Event(type) {
    this.type = type;
}

Event.prototype.getType = function () {
    return this.type;
};

module.exports = Event;
