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
    this.onDataCallback = null;
}

TcpTransport.prototype = Object.create(ControlTransportApi.prototype);

TcpTransport.prototype.constructor = TcpTransport;

TcpTransport.prototype._onMessage = function (data) {
    if (this.onDataCallback == null) {
        this.queuedMessages.push(data);
    } else {
        this.onDataCallback(data);
    }
};

TcpTransport.prototype.connect = function (url, callback) {
    url = url.replace("tcp://", "");
    var portIndex = url.indexOf(":");
    this.host = url.substr(0, portIndex);
    this.port = url.substr(portIndex + 1);
    var _this = this;
    var callback2 = function(){
        _this.session.on('data', function (data) {
            _this._onMessage(data.toString());
        });
        callback();
    };
    this.session = net.connect({port: this.port, host: this.host}, callback2);
};

TcpTransport.prototype.write = function (msg, callback) {
    this.session.write(msg, callback);
};

TcpTransport.prototype.flush = function (callback) {
    // NOOP
};

TcpTransport.prototype.onMessage = function (callback) {
    this.onDataCallback = callback;
    while (this.queuedMessages.length > 0) {
        this.onDataCallback(this.queuedMessages.shift());
    }
};

TcpTransport.prototype.disconnect = function(callback){
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