var k3poControl = require('../../src/base/K3poControl.js'),
    K3poControl = k3poControl.K3poControl,
    AbortCommand = k3poControl.AbortCommand,
    AwaitCommand = k3poControl.AwaitCommand,
    NotifyCommand = k3poControl.NotifyCommand,
    PrepareCommand = k3poControl.PrepareCommand,
    StartCommand = k3poControl.StartCommand;

function K3poRunner(k3poControl, done) {
    this.state = "INITIAL"; // INITIAL, START, STARTED
    this.k3poControl = k3poControl;
    this.scriptRoot = null;
    this.done = done;
    this.actual = "";
    this.expected = null;
    var _this = this;
    _this.errorSummary = null;
    _this.errorDescription = null;
    k3poControl.on('ERROR', function (event) {
        _this.state = "ERROR";
        _this.errorSummary = event.getSummary();
        _this.errorDescription = event.getDescription();
        done();
    });
    k3poControl.on('FINISHED', function (event) {
        _this.state = "FINISHED";
        _this.actual = event.getScript();
        done();
    });
}

K3poRunner.prototype.getErrorSummary = function(){
    return this.errorSummary;
};

K3poRunner.prototype.getErrorDescription = function(){
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
            var _this = this;
            this.k3poControl.on("PREPARED", function (preparedEvent) {
                _this.expected = preparedEvent.getScript();
                _this.state = "PREPARED";
                callback();
            });
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
        var cmd = new StartCommand();
        this.k3poControl.on("STARTED", function () {
            _this.state = "STARTED";
            if (callback) {
                callback();
            }
        });
        _this.state = "START";
        this.startCallbacks = [];
        this.startCallbacks.push(callback);
        this.k3poControl.sendCommand(cmd, function () {
            for (var i = 0; i < _this.startCallbacks.length; i++) {
                if (_this.startCallbacks[i]) {
                    _this.startCallbacks[i]();
                }
            }
        });
    } else if (this.state === "START") {
        this.startCallbacks.push(callback);
    } else {
        callback();
    }
};

K3poRunner.prototype.dispose = function(){
   this.k3poControl.disconnect();
};

K3poRunner.prototype.getState = function(){
    return this.state;
};

K3poRunner.prototype.notifyBarrier = function(barrier){
    var cmd = new NotifyCommand(barrier);
    this.k3poControl.sendCommand(cmd ,function(){

    });
};

K3poRunner.prototype.awaitBarrier = function(barrier, callback){
    var cmd = new AwaitCommand(barrier);
    this.k3poControl.on("NOTIFIED", function(event){
        if(event.getBarrier() === barrier){
            callback();
        }
    });
    this.k3poControl.sendCommand(cmd, function(){

    });
};
module.exports = K3poRunner;