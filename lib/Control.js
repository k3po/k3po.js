'use strict';
var ErrorEvent = require('./events/ErrorEvent.js');
var FinishedEvent = require('./events/FinishedEvent.js');
var NotifiedEvent = require('./events/NotifiedEvent.js');
var PreparedEvent = require('./events/PreparedEvent.js');
var StartedEvent = require('./events/StartedEvent.js');
var Command = require('./commands/Command.js');

var controlTransportFactory = require("./transports/ControlTransportFactory.js");

/**
 * Control is a class that connects to Control
 * @param connectURL
 * @constructor
 */
function K3poControl() {
    this.connection = null;
    this.queuedEvents = [];
    this.eventCallbacks = [];
}

/**
 * Sends a Command to the K3poDriver
 * @param cmd
 * @param callback
 */
K3poControl.prototype.sendCommand = function (cmd, callback) {
    if (cmd instanceof Command) {
        var buf = "";
        switch (cmd.getType()) {
            case "ABORT":
                buf += "ABORT\n";
                buf += "\n";
                break;
            case "AWAIT":
                buf += "AWAIT\n";
                buf += "barrier:" + cmd.getBarrier() + "\n";
                buf += "\n";
                break;
            case "NOTIFY":
                buf += "NOTIFY\n";
                buf += "barrier:" + cmd.getBarrier() + "\n";
                buf += "\n";
                break;
            case "PREPARE":
                buf += "PREPARE\n";
                buf += "version:2.0\n";
                var scripts = cmd.getScripts();
                for (var i = 0; i < scripts.length; i++) {
                    buf += "name:" + scripts[i] + "\n";
                }
                buf += "\n";
                break;
            case "START":
                buf += "START\n";
                buf += "\n";
                break;
            default:
                throw ("Unrecognized cmd: " + cmd.getType());
        }
        this.connection.write(buf);
        this.connection.flush(callback);
    } else {
        throw "Invalid Argument, cmd must be instance of Command";
    }
};

K3poControl.prototype.on = function (event, listener) {
    //console.info("On " + event + " do " + listener);
    switch (event) {
        case "ERROR":
        case "FINISHED":
        case "NOTIFIED":
        case "PREPARED":
        case "STARTED":
            var callbacks = this.eventCallbacks[event];
            if (callbacks == null) {
                this.eventCallbacks[event] = [];
            }
            this.eventCallbacks[event].push(listener);
            break;
        default:
            throw ("Unrecognized event to register too: " + event);
    }
    for (var i = 0; i < this.queuedEvents.length; i++) {
        var e = this.queuedEvents[i];
        if (e.getType() === event) {
            listener(e);
            this.queuedEvents.splice(i, 1);
        }
    }
};

K3poControl.prototype.addEventListener = K3poControl.prototype.on;

/**
 * Connects to the K3po Server
 * @param callback
 */
K3poControl.prototype.connect = function (connectURL, callback) {
    this.connection = controlTransportFactory.connect(connectURL, callback);
    if (this.connection == null) {
        throw "Control could not connect";
    }

    function parseHeaders(headers) {
        var result = {};
        headers = headers.split("\n");
        for (var i = 0; i < headers.length; i++) {
            var r = headers[i].split(":");
            var key = r[0];
            var value = r[1];
            result[key] = value;
        }
        return result;
    }

    function parseContent(contentLength, content) {
        if (parseInt(contentLength) <= content.length) {
            return content.substring(0, contentLength);
        } else {
            // TODO, properly type exceptions
            throw "NOT_ENOUGH_BUFFERED";
        }
    }

    function parseError(headers, content) {
        headers = parseHeaders(headers);
        var summary = headers["summary"];
        var contentLength = headers["content-length"];
        return new ErrorEvent(summary, parseContent(contentLength, content));
    }

    function parseFinished(headers, content) {
        headers = parseHeaders(headers);
        var contentLength = headers["content-length"];
        return new FinishedEvent(parseContent(contentLength, content));
    }

    function parseNotified(headers) {
        headers = parseHeaders(headers);
        var barrier = headers["barrier"];
        return new NotifiedEvent(barrier);
    }

    function parsePrepared(headers, content) {
        headers = parseHeaders(headers);
        var contentLength = headers["content-length"];
        return new PreparedEvent(parseContent(contentLength, content));
    }

    function parseStarted() {
        return new StartedEvent();
    }

    var _this = this;
    var buf = "";

    this.connection.onMessage(
        function (message) {
            buf += message;
            message = buf;
            try {
                do {
                    var eventTypeTerminator = message.indexOf("\n");
                    var headerTerminator = message.indexOf("\n\n");
                    if (headerTerminator < eventTypeTerminator || eventTypeTerminator <= 0) {
                        // Not enough buffered to read from
                        return;
                    } else {
                        buf = buf.substring(headerTerminator + 2, buf.length);
                    }
                    var contentTerminator = message.length;
                    var eventType = message.substr(0, eventTypeTerminator);
                    var headers = message.substr(eventTypeTerminator + 1, headerTerminator);
                    var content = message.substr(headerTerminator + 2, contentTerminator);
                    var event;
                    //console.log("Received event " + eventType + ", with callbacks: " + _this.eventCallbacks[eventType]);
                    switch (eventType) {
                        case "ERROR":
                            event = parseError(headers, content);
                            buf = buf.substring(event.getDescription().length, buf.length);
                            break;
                        case "FINISHED":
                            event = parseFinished(headers, content);
                            buf = buf.substring(event.getScript().length, buf.length);
                            break;
                        case "NOTIFIED":
                            event = parseNotified(headers);
                            break;
                        case "PREPARED":
                            event = parsePrepared(headers, content);
                            buf = buf.substring(event.getScript().length, buf.length);
                            break;
                        case "STARTED":
                            event = parseStarted();
                            break;
                        default:
                            throw ("Unrecognized event: " + eventType);
                    }
                    if (!_this.eventCallbacks[eventType]) {
                        _this.queuedEvents.push(event);
                    } else {
                        for (var i = 0; i < _this.eventCallbacks[eventType].length; i++) {
                            _this.eventCallbacks[eventType][i](event);
                        }
                    }
                    message = buf;
                } while (buf.length > 0);
            } catch (err) {
                if (err === "NOT_ENOUGH_BUFFERED") {
                    // This is an out for not having fully read tcp event
                } else {
                    throw err;
                }
            }
        });
};

/**
 * Disconnects from the K3poDriver
 * @param callback
 */
K3poControl.prototype.disconnect = function (callback) {
    this.connection.disconnect(callback);
};

module.exports = K3poControl;
