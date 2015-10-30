'use strict';

var controlTransportFactory = require("../../src/base/ControlTransportFactory.js");

/**
 * Command is an abstract class that represents a K3po Command
 * @param type
 * @constructor
 */
function Command(type) {
    this.type = type;
}

Command.prototype.getType = function () {
    return this.type;
};

/**
 * Aborts the script execution
 * @constructor
 */
function AbortCommand() {
    Command.call(this, "ABORT");
}

AbortCommand.prototype = Object.create(Command.prototype);

AbortCommand.prototype.constructor = AbortCommand;

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

/**
 * Prepares the driver for running
 * @param scripts
 * @constructor
 */
function PrepareCommand(scripts) {
    Command.call(this, "PREPARE");

    if (scripts.constructor === Array) {
        this.scripts = scripts;
    } else {
        throw "Invalid argument, scripts is not an Array";
    }
}

PrepareCommand.prototype = Object.create(Command.prototype);

PrepareCommand.prototype.constructor = PrepareCommand;

PrepareCommand.prototype.getScripts = function () {
    return this.scripts;
};

/**
 * Starts the script execution
 * @constructor
 */
function StartCommand() {
    Command.call(this, "START");
}

StartCommand.prototype = Object.create(Command.prototype);

StartCommand.prototype.constructor = StartCommand;

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

/**
 * Notification that the script has started
 * @constructor
 */
function StartedEvent() {
    Event.call(this, "STARTED");
}

StartedEvent.prototype = Object.create(Event.prototype);

StartedEvent.prototype.constructor = StartedEvent;

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
                buf += "barrier" + cmd.getBarrier() + "\n";
                buf += "\n";
                break;
            case "NOTIFY":
                buf += "NOTIFY\n";
                buf += "barrier" + cmd.getBarrier() + "\n";
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

/**
 * Reads a Event from the K3poDriver
 * @param callback, which is called with the event, i.e. callback(event)
 */
K3poControl.prototype.onEvent = function (callback) {
    this.onEventCallback = callback;
    while (this.queuedEvents.length > 0) {
        this.onEventCallback(this.queuedEvents.shift());
    }

};

/**
 * K3poControl is a class that connects to K3poControl
 * @param connectURL
 * @constructor
 */
function K3poControl() {
    this.connection = null;
    this.queuedEvents = [];
    this.onEventCallback = null;
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

function parseError(headers, content) {
    headers = parseHeaders(headers);
    var summary = headers["summary"];
    var contentLength = headers["content-length"];
    if (parseInt(contentLength) === content.length) {
        return new ErrorEvent(summary, content);
    } else {
        throw "TODO, error reading Error event, need to handle dynamic buffers in transport";
    }
}

function parseFinished(headers, content) {
    headers = parseHeaders(headers);
    var contentLength = headers["content-length"];
    if (parseInt(contentLength) === content.length) {
        return new FinishedEvent(content);
    } else {
        throw "TODO, error reading Finished event, need to handle dynamic buffers in transport";
    }
}

function parseNotified(headers) {
    headers = parseHeaders(headers);
    var barrier = headers["barrier"];
    return new NotifiedEvent(barrier);
}

function parsePrepared(headers, content) {
    // TODO
}

function parseStarted() {
    return new StartedEvent()
}

/**
 * Connects to the K3po Server
 * @param callback
 */
K3poControl.prototype.connect = function (connectURL, callback) {
    this.connection = controlTransportFactory.connect(connectURL, callback);

    var _this = this;

    this.connection.onMessage(
        function (message) {
            var eventTypeTerminator = message.indexOf("\n");
            var headerTerminator = message.indexOf("\n\n");
            var contentTerminator = message.length;
            var eventType = message.substr(0, eventTypeTerminator);
            var headers = message.substr(eventTypeTerminator + 1, headerTerminator);
            var content = message.substr(headerTerminator + 2, contentTerminator);
            var event;

            switch (eventType) {
                case "ERROR":
                    event = parseError(headers, content);
                    break;
                case "FINISHED":
                    event = parseFinished(headers, content);
                    break;
                case "NOTIFIED":
                    event = parseNotified(headers);
                    break;
                case "PreparedEvent":
                    event = parsePrepared(headers, content);
                    break;
                case "StartedEvent":
                    event = parseStarted();
                    break;
                default:
                    throw ("Unrecognized event: " + eventType);
            }
            if (_this.onEventCallback == null) {
                _this.queuedEvents.push(event);
            } else {
                _this.onEventCallback(event);
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

var k3poControl = exports;
k3poControl.K3poControl = K3poControl;
k3poControl.AbortCommand = AbortCommand;
k3poControl.AwaitCommand = AwaitCommand;
k3poControl.PrepareCommand = PrepareCommand;
k3poControl.StartCommand = StartCommand;
// Don't think there is a need to exports events because only K3poControl Constructs them