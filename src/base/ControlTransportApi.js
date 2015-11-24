/**
 * Interface for K3po Control Transports
 * @constructor
 */
var ControlTransportApi = function() {

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
 * callback to be called when there is a message or data
 * @param event
 * @param listener
 */
ControlTransportApi.prototype.on = function (event, listener) {
    throw "on(event, listener) Not Implemented";
};
ControlTransportApi.prototype.addEventListener = ControlTransportApi.prototype.on;

exports.ControlTransportApi = ControlTransportApi;
