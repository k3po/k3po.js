var Event = require("./Event.js");

/**
 * When an error has occured
 * @param summary
 * @param description
 * @constructor
 */
function ErrorEvent(summary, description) {
    Event.call(this, "ERROR");
    this.summary = summary;
    this.description = description;
}

ErrorEvent.prototype = Object.create(Event.prototype);

ErrorEvent.prototype.constructor = ErrorEvent;

ErrorEvent.prototype.getSummary = function () {
    return this.summary;
};

ErrorEvent.prototype.getDescription = function () {
    return this.description;
};


module.exports = ErrorEvent;