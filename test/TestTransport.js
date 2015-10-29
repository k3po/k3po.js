var ControlTransportApi = require('../src/base/ControlTransportApi.js').ControlTransportApi;

/**
 * Test transport used as mock for testing
 * @constructor
 */
function TestTransport(url) {
    ControlTransportApi.call(this);
    this.url = url;
}

TestTransport.prototype = Object.create(ControlTransportApi.prototype);

TestTransport.prototype.constructor = ControlTransportApi;

module.export = TestTransport;
