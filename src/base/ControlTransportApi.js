/**
 * Interface that ControlTransportFactory can create connections from
 * @constructor
 */
var ControlTransportApi = function(scheme) {
    this.scheme = scheme;
};

ControlTransportApi.prototype.getScheme = function () {
    return this.scheme;
};

/**
 * Connects the transport and establishes a session
 * @param url
 * @param callback
 */
ControlTransportApi.prototype.connect = function (url, callback) {
    throw "connect(url, callback) Not Implemented";
};

/**
 * Disconnects the transport and sesion
 * @param callback
 */
ControlTransportApi.prototype.disconnect = function (callback) {
    throw "disconnect(callback) Not Implemented";
};

/**
 * Fills buffer with values that can be written
 * @param msg
 * @param callback
 */
ControlTransportApi.prototype.write = function (msg, callback) {
    throw "write(msg, callback) Not Implemented";
};

/**
 * Flushes buffer
 * @param callback
 */
ControlTransportApi.prototype.flush = function (callback) {
    throw "flush(callback) Not Implemented";
};

/**
 * Returns a string buffer.
 * @param callback (will be called with callback(data))
 */
ControlTransportApi.prototype.read = function (callback) {
    throw "read(callback) Not Implemented";
};

exports.ControlTransportApi = ControlTransportApi;