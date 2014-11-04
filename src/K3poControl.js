'use strict';

function K3poControl(verbose) {
    this.verbose = false;
    if(verbose){
        this.verbose = verbose;
    }
}

/**
 * Will be called when prepared is received
 * @param expectedScript
 */
K3poControl.prototype.onPrepared = function (expectedScript) {

};

/**
 * Will be called when started is received
 * @param errorMsg
 */
K3poControl.prototype.onStarted = function () {

};

/**
 * Will be called when finished is received
 * @param observedScript
 */
K3poControl.prototype.onFinished = function (observedScript) {

};

/**
 * Will be called error is received
 * @param errorMsg
 */
K3poControl.prototype.onError = function (errorMsg) {

};

/**
 * Returns a prepare message
 * @param scripts is a array os scripts to return
 * @returns {string}
 */
K3poControl.prototype.makePrepare = function (scripts) {
    var version = "2.0";
    var prepareCMD = "PREPARE\n" + "version:" + version + "\n";
    if (scripts) {
        for (var i = 0; i < scripts.length; i++) {
            prepareCMD += "name:" + scripts[i] + "\n";
        }
    }
    prepareCMD += "\n";
    return prepareCMD;
};

/**
 * Returns a start message
 * @returns {string}
 */
K3poControl.prototype.makeStart = function () {
    return "START\n\n";
};

/**
 * Returns an abort message
 * @returns {string}
 */
K3poControl.prototype.makeAbort = function () {
    return "ABORT\n\n";
};

/**
 * Utility method to parse an event message and
 * call the appropriate listener methods
 * @param eventMsg
 * @returns {string} eventType
 */
K3poControl.prototype.handleEvent = function (eventMsg) {
    if(this.verbose){
        console.log("Received message:" + eventMsg);
    }
    var eventLineByLine = eventMsg.match(/[^\n]+/g);
    var eventType = eventLineByLine[0];

    function getHeader(eventLineByLine, header) {
        for (var i = 0; i < eventLineByLine.length; i++) {
            var line = eventLineByLine[i];
            if (line.indexOf(header) === 0) {
                return line.split(":")[1];
            }
        }
        return null;
    }

    var contentLength = 0;
    switch (eventType) {
        case "PREPARED":
            contentLength = getHeader(eventLineByLine, "content-length");
            this.onPrepared(eventMsg.substr(eventMsg.length - contentLength));
            break;
        case "FINISHED":
            contentLength = getHeader(eventLineByLine, "content-length");
            this.onFinished(eventMsg.substr(eventMsg.length - contentLength));
            break;
        case "STARTED":
            this.onStarted();
            break;
        default:
            this.onError("Unrecognized event type: " + eventType);
            eventType = "ERROR";
    }
    return eventType;
};

module.exports = K3poControl;