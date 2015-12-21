var net = require('net');
var ControlTransportApi = require('./ControlTransportApi.js');
var ControlTransportFactorySpi = require('./ControlTransportFactorySpi.js');
var controlTransportFactory = require('./ControlTransportFactory.js');

/**
 * K3po Control Transport for when running in node
 * @constructor
 */
function TcpTransport() {
    ControlTransportApi.call(this);
    this.queuedMessages = [];
    this.eventCallbacks = [];
}

TcpTransport.prototype = Object.create(ControlTransportApi.prototype);

TcpTransport.prototype.constructor = TcpTransport;

TcpTransport.prototype._on = function (data) {
    if (this.eventCallbacks['data'] == null) {
        this.queuedMessages.push(data);
    } else {
        this.eventCallbacks['data'](data);
    }
};

TcpTransport.prototype.connect = function (url, callback) {
    url = url.replace("tcp://", "");
    var portIndex = url.indexOf(":");
    this.host = url.substr(0, portIndex);
    this.port = url.substr(portIndex + 1);
    var _this = this;
    var callback2 = function () {
        _this.session.on('data', function (data) {
            _this._on(data.toString());
        });
        callback();
    };
    this.session = net.connect({port: this.port, host: this.host}, callback2);
};

TcpTransport.prototype.write = function (msg, callback) {
    this.session.write(msg, callback);
};

TcpTransport.prototype.flush = function (callback) {
    if (callback) {
        callback();
    }
};

TcpTransport.prototype.on = function(event, listener){
    switch (event) {
        case "data":
            this.eventCallbacks[event] = listener;
            break;
        default:
            throw new Error("Unrecognized event to register too: " + event);
    }

    for(var i = 0; i < this.queuedMessages.length; i ++){
        var e = this.queuedMessages[i];
        if(e.getType() === event){
            listener(e);
            this.queuedMessages.splice(i, 1);
        }
    }
};

TcpTransport.prototype.disconnect = function (callback) {
    this.session.end();
};

/**
 * TcpTransportFactory
 * @constructor
 */
function TcpTransportFactory() {
    ControlTransportFactorySpi.call(this, "tcp");
}

TcpTransportFactory.prototype = Object.create(ControlTransportFactorySpi.prototype);

TcpTransportFactory.prototype.constructor = TcpTransportFactory;

TcpTransportFactory.prototype.connect = function (url, callback) {
    var tcpTransport = new TcpTransport();
    tcpTransport.connect(url, callback);
    return tcpTransport;
};

controlTransportFactory.registerTransportFactorySpi(new TcpTransportFactory());
