var k3poControl = require('../../src/base/K3poControl.js'),
    K3poControl = k3poControl.K3poControl,
    AbortCommand = k3poControl.AbortCommand,
    AwaitCommand = k3poControl.AwaitCommand,
    NotifyCommand = k3poControl.NotifyCommand,
    PrepareCommand = k3poControl.PrepareCommand,
    StartCommand = k3poControl.StartCommand;

function K3poRunner(k3poControl) {
    this.state = "INITIAL"; // INITIAL, START, STARTED
    this.k3poControl = k3poControl;
    this.scriptRoot = null;
    this.eventListeners = [];
}

K3poRunner.prototype.setScriptRoot = function (root) {
    this.scriptRoot = root;
};


K3poRunner.prototype.handlePrepared = function (callback) {
    switch (this.state) {
        case "PREPARE":
            this.state = "PREPARED";
            callback();
            break;
        default:
            throw "Can not call handlePrepared from state: " + this.state;
    }
};

K3poRunner.prototype.on = function (event, callback) {
    var registeredListiners = this.eventListeners[event];
    if (!registeredListiners) {
        registeredListiners = [];
    }
    registeredListiners.push(callback);
};

K3poRunner.prototype._setUpStateListeners = function () {
    this.on("PREPARED", function () {
        if (_this.state === "PREPARE") {
            _this.state === "PREPARED";
        } else {
            throw "Trying to switch to state PREPARED from " + _this.state;
        }
    });
    this.on("STARTED", function () {
        if (_this.state === "START") {
            _this.state === "STARTED";
        } else {
            throw "Trying to switch to state STARTED from " + _this.state;
        }
    });
};

K3poRunner.prototype.prepare = function (scripts, callback) {
    if (this.scriptRoot != null) {
        for (var i = 0; i < scripts.length; i++) {
            // hmm maybe control protocol should be aware of script root
            scripts[i] = this.scriptRoot + "/" + scripts[i];
        }

    }

    var cmd = new PrepareCommand(scripts);
    switch (this.state) {
        case "INITIAL":
            this._setUpStateListeners();
            this.on("PREPARED", callback);
            var _this = this;
            this.k3poControl.sendCommand(cmd, function () {
                _this.state = "PREPARE";
            });
            break;
        default:
            throw "Can not call prepare from state: " + this.state;
    }
};

K3poRunner.prototype.start = function (callback) {
    if (this.state === "PREPARED") {
        var _this = this;
        this.on("START", callback);
        this.k3poControl.sendCommand(cmd, function () {
            _this.state = "START";
        });
    } else {
        throw "Cant call start for state: " + this.state;
    }
};

module.exports = K3poRunner;