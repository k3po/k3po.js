'use strict';

/**
 * A Factory to load reliable K3po Control Transports from, that implements ControlTransportSpi
 * @constructor
 */
function ControlTransportFactory() {
    this.schemeToTransportMap = {};
}

ControlTransportFactory.createConnection = function (connectURL) {
    var getUrlScheme = function (url) {
        return url.split(":")[0];
    };

    var scheme = getUrlScheme(connectURL);
    return this.schemeToTransportMap[scheme];
};

ControlTransportFactory.addConnectionType = function (controlTransportSpi) {
    var scheme = controlTransportSpi.getScheme();
    this.schemeToTransportMap[scheme] = controlTransportSpi;
};

/**
 * Interface that ControlTransportFactory can create connections from
 * @constructor
 */
function ControlTransportSpi(scheme) {
    this.scheme = scheme;
}

ControlTransportSpi.prototype.getScheme = function () {
    return this.scheme;
};

/**
 * Connects the transport and establishes a session
 * @param callback
 */
ControlTransportSpi.prototype.connect = function (callback) {
    throw "connect(callback) Not Implemented";
};

/**
 * Disconnects the transport and sesion
 * @param callback
 */
ControlTransportSpi.prototype.disconnect = function (callback) {
    throw "disconnect(callback) Not Implemented";
};

/**
 * Fills buffer with values that can be written
 * @param msg
 * @param callback
 */
ControlTransportSpi.prototype.write = function (msg, callback) {
    throw "write(msg, callback) Not Implemented";
};

/**
 * Flushes buffer
 * @param callback
 */
ControlTransportSpi.prototype.flush = function (callback) {
    throw "flush(callback) Not Implemented";
};

/**
 * Returns a string buffer.
 * @param callback (will be called with callback(data))
 */
ControlTransportSpi.prototype.read = function (callback) {
    throw "read(callback) Not Implemented";
};