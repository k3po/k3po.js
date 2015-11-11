var K3poControl = require('./K3poControl.js');
var AbortCommand = require('./commands/AbortCommand.js');
var AwaitCommand = require('./commands/AwaitCommand.js');
var NotifyCommand = require('./commands/NotifyCommand.js');
var PrepareCommand = require('./commands/PrepareCommand.js');
var StartCommand = require('./commands/StartCommand.js');

function K3poRunner(k3poControl) {
    this._state = "INITIAL"; // INITIAL, START, STARTED
    this.stateListenerMap = [];
    this.k3poControl = k3poControl;
    this.scriptRoot = null;
    this.actual = "";
    this.expected = null;
    var _this = this;
    _this.errorSummary = null;
    _this.errorDescription = null;


    k3poControl.on('ERROR', function (event) {
        _this.errorSummary = event.getSummary();
        _this.errorDescription = event.getDescription();
        _this._changeState("ERROR");
    });
    k3poControl.on('FINISHED', function (event) {
        _this.actual = event.getScript();
        _this._changeState("FINISHED");
    });
    k3poControl.on('STARTED', function (event) {
        _this._changeState("STARTED");
    });
    k3poControl.on('PREPARED', function (event) {
        _this.expected = event.getScript();
        _this._changeState("PREPARED");
    });
    // TODO
    //k3poControl.on('DISPOSED', function (event) {
    //    _this.k3poControl.disconnect();
    //    _this._changeState("DISPOSED");
    //});
}

K3poRunner.prototype.getErrorSummary = function () {
    return this.errorSummary;
};

K3poRunner.prototype.getErrorDescription = function () {
    return this.errorDescription;
};

K3poRunner.prototype.setScriptRoot = function (root) {
    this.scriptRoot = root;
};

K3poRunner.prototype.getExpected = function () {
    return this.expected;
};

K3poRunner.prototype.getActual = function () {
    return this.actual;
};

K3poRunner.prototype.prepare = function (scripts) {
    if (this.scriptRoot != null) {
        for (var i = 0; i < scripts.length; i++) {
            // hmm maybe control protocol should be aware of script root
            scripts[i] = this.scriptRoot + "/" + scripts[i];
        }
    }
    var cmd = new PrepareCommand(scripts);
    this._changeState("PREPARE");
    this.k3poControl.sendCommand(cmd);
};

K3poRunner.prototype.start = function () {
    try {
        this._changeState("START");
        var cmd = new StartCommand();
        this.k3poControl.sendCommand(cmd);
    } catch (err) {
        // NOOP, we will let test frameworks call start multiple times
    }
};

K3poRunner.prototype.abort = function () {
    try {
        var cmd = new AbortCommand();
        this._changeState("ABORT");
        this.k3poControl.sendCommand(cmd);
    } catch (err) {
        console.warn(err);
    }
};

K3poRunner.prototype.dispose = function () {
    try {
        this._changeState("DISPOSE");
        // TODO implement DISPOSE command and send
        this.k3poControl.disconnect();
    } catch (err) {
        console.warn(err);
    }

};

K3poRunner.prototype.notifyBarrier = function (barrier) {
    var cmd = new NotifyCommand(barrier);
    this.k3poControl.sendCommand(cmd);
};

K3poRunner.prototype.awaitBarrier = function (barrier, callback) {
    var cmd = new AwaitCommand(barrier);
    this.k3poControl.on("NOTIFIED", function (event) {
        if (event.getBarrier() === barrier) {
            callback();
        }
    });
    this.k3poControl.sendCommand(cmd);
};

K3poRunner.prototype.on = function (state, listener) {
    // TODO, validate state is a valid name?
    var arrayOfListeners = this.stateListenerMap[state];
    if (!arrayOfListeners) {
        arrayOfListeners = [];
    }
    arrayOfListeners.push(listener);
    this.stateListenerMap[state] = arrayOfListeners;
};

/**
 * Internal call to change state, throws exception if can not
 * change from one valid state to another.
 * @param newState
 * @private
 */
K3poRunner.prototype._changeState = function (newState) {
    var currentState = this._state;
    //console.trace("Changing from state " + currentState + " to " + newState);
    switch (newState) {
        case "INITIAL":
            throw "Cannot change into INITIAL state";
        case "PREPARE":
            if (currentState !== "INITIAL") {
                throw ("Cannot change into " + newState + " from " + currentState);
            }
            break;
        case "PREPARED":
            if (currentState !== "PREPARE") {
                throw ("Cannot change into " + newState + " from " + currentState);
            }
            break;
        case "START":
            if (currentState !== "PREPARED") {
                throw ("Cannot change into " + newState + " from " + currentState);
            }
            break;
        case "STARTED":
            if (currentState !== "START") {
                throw ("Cannot change into " + newState + " from " + currentState);
            }
            break;
        case "FINISHED":
            if (currentState !== "PREPARED" && currentState !== "STARTED" && currentState !== "ABORT") {
                throw ("Cannot change into " + newState + " from " + currentState);
            }
            break;
        case "ABORT":
            if (currentState === "FINISHED" || currentState === "DISPOSE" || currentState === "DISPOSED") {
                throw ("Trying to abort while already finished and cleaning up, current state is " + currentState);
            }
            break;
        case "DISPOSE":
            if (currentState !== "FINISHED") {
                throw ("Cannot change into " + newState + " from " + currentState);
            }
            break;
        case "DISPOSED":
            if (currentState !== "DISPOSE") {
                throw ("Cannot change into " + newState + " from " + currentState);
            }
            break;
        case "ERROR":
            break;
        default:
            throw ("Unrecognized state to change to " + newState);
    }
    this._state = newState;
    var arrayOfListeners = this.stateListenerMap[newState];
    if (arrayOfListeners) {
        for (var i = 0; i < arrayOfListeners.length; i++) {
            arrayOfListeners[i]();
        }
    }
};

module.exports = K3poRunner;