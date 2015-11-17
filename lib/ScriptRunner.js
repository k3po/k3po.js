var Control = require('./Control.js');
var AbortCommand = require('./commands/AbortCommand.js');
var AwaitCommand = require('./commands/AwaitCommand.js');
var NotifyCommand = require('./commands/NotifyCommand.js');
var PrepareCommand = require('./commands/PrepareCommand.js');
var StartCommand = require('./commands/StartCommand.js');
var Promise = require('promise');

function ScriptRunner(url, root) {
    if (url === null) {
        url = "tcp://localhost:11642";
    }
    if (!root) {
        root = "";
    }
    this._url = url;
    this._root = root;
    this._control = new Control();

    this._state = "INITIAL";
    this._stateListenerMap = [];

    this._actual = "";
    this._expected = null;

    this._errorSummary = null;
    this._errorDescription = null;

    var _this = this;
    this._control.on('ERROR', function (event) {
        _this._errorSummary = event.getSummary();
        _this._errorDescription = event.getDescription();
        _this._changeState("ERROR");
    });
    this._control.on('FINISHED', function (event) {
        _this._actual = event.getScript();
        _this._changeState("FINISHED");
    });
    this._control.on('STARTED', function () {
        _this._changeState("STARTED");
    });
    this._control.on('PREPARED', function (event) {
        _this._expected = event.getScript();
        _this._changeState("PREPARED");
    });
    // TODO
    //_control.on('DISPOSED', function (event) {
    //    _this._control.disconnect();
    //    _this._changeState("DISPOSED");
    //});
}

//ScriptRunner._root = function(_root){
//    this._root = _root;
//};

ScriptRunner.prototype.getErrorSummary = function () {
    return this._errorSummary;
};

ScriptRunner.prototype.getErrorDescription = function () {
    return this._errorDescription;
};

ScriptRunner.prototype.getExpected = function () {
    return this._expected;
};

ScriptRunner.prototype.getActual = function () {
    return this._actual;
};

ScriptRunner.prototype.prepare = function (scripts) {
    var _this = this;
    return new Promise(function (fulfill, reject) {
        _this._control.connect(_this._url, function () {
            try {
                if (_this._root != null) {
                    for (var i = 0; i < scripts.length; i++) {
                        scripts[i] = _this._root + "/" + scripts[i];
                    }
                }
                var cmd = new PrepareCommand(scripts);
                _this._changeState("PREPARE");
                _this._control.sendCommand(cmd);
                _this.on("PREPARED", fulfill);
            } catch (err) {
                reject(err);
            }
        });
    });


};

ScriptRunner.prototype.start = function () {
    var _this = this;
    return new Promise(function (fulfill, reject) {
        try {
            _this._changeState("START");
            _this._control.sendCommand(new StartCommand());
            _this._control.on("STARTED", fulfill);
        } catch (err) {
            reject(err);
        }
    });
};


ScriptRunner.prototype.abort = function () {
    var _this = this;
    return new Promise(function (fulfill, reject) {
        try {
            var cmd = new AbortCommand();
            _this._changeState("ABORT");
            _this._control.sendCommand(cmd);
            fulfill();
        } catch (err) {
            reject(err);
        }
    });
};

ScriptRunner.prototype.dispose = function () {
    var _this = this;
    return new Promise(function (fulfill, reject) {
        try {
            _this._changeState("DISPOSE");
            // TODO implement DISPOSE command and send
            _this._control.disconnect();
            fulfill();
        } catch (err) {
            reject(err);
        }
    });
};

ScriptRunner.prototype.notify = function (barrier) {
    var _this = this;
    return new Promise(function (fulfill, reject) {
        try {
            var cmd = new NotifyCommand(barrier);
            _this._control.sendCommand(cmd);
            fulfill();
        } catch (err) {
            reject(err);
        }
    });
};

ScriptRunner.prototype.await = function (barrier) {
    var _this = this;
    return new Promise(function (fulfill, reject) {
        try {
            var cmd = new AwaitCommand(barrier);
            _this._control.on("NOTIFIED", function (event) {
                if (event.getBarrier() === barrier) {
                    fulfill();
                }
            });
            _this._control.sendCommand(cmd);
        } catch (err) {
            reject(err);
        }
    });
};

ScriptRunner.prototype.finish = function () {
    var _this = this;
    return new Promise(function (fulfill, reject) {
        try {
            var noop = function () {
                // allow start to be called from here if not already called
            };
            _this.on("FINISH", fulfill);
            _this.start().then(noop, noop);
        } catch (err) {
            reject(err);
        }
    });

};

ScriptRunner.prototype.on = function (state, listener) {
    // TODO, validate state is a valid name?
    var arrayOfListeners = this._stateListenerMap[state];
    if (!arrayOfListeners) {
        arrayOfListeners = [];
    }
    arrayOfListeners.push(listener);
    this._stateListenerMap[state] = arrayOfListeners;
};

/**
 * Internal call to change state, throws exception if can not
 * change from one valid state to another.
 * @param newState
 * @private
 */
ScriptRunner.prototype._changeState = function (newState) {
    var currentState = this._state;
    //console.log("Changing from state " + currentState + " to " + newState);
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
            if (currentState !== "FINISHED" && currentState !== "ERROR") {
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
    var arrayOfListeners = this._stateListenerMap[newState];
    if (arrayOfListeners) {
        for (var i = 0; i < arrayOfListeners.length; i++) {
            arrayOfListeners[i]();
        }
    }
};

module.exports = ScriptRunner;