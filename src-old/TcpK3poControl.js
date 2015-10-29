'use strict';

var net = require('net');
var K3poControl = require('../src/base/K3poControl.js');

function TcpK3poControl(host, port, verbose) {
    this.port = port;
    this.host = host;
    this.client = null;
    this.state = null;
    this.verbose = false;
    if (verbose) {
        this.verbose = true;
    }
}

TcpK3poControl.prototype = new K3poControl();

TcpK3poControl.prototype.constructor = TcpK3poControl;

/**
 * Prepares K3po
 * @param scripts
 */
TcpK3poControl.prototype.prepare = function (scripts) {
    var _this = this;
    var client = net.connect({port: this.port, host: this.host}, function () {
        client.write(_this.makePrepare(scripts));
    });
    client.on('data', function (data) {
        var eventType = _this.handleEvent(data.toString());
        _this.state = eventType;
        switch(eventType) {
            case "FINISHED":
                client.end();
                break;
            default:
        }
    });

    this.client = client;
};

/**
 * Starts the robot
 */
TcpK3poControl.prototype.start = function () {
    this.client.write(this.makeStart());
};

/**
 * Aborts a robot execution
 */
TcpK3poControl.prototype.abort = function () {
    this.client.write(this.makeAbort());
};

module.exports = TcpK3poControl;