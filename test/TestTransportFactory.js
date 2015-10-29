var ControlTransportApi = require('../src/base/ControlTransportApi.js').ControlTransportApi;
var ControlTransportFactorySpi = require('../src/base/ControlTransportFactorySpi.js').ControlTransportFactorySpi;
var controlTransportFactory = require('../src/base/ControlTransportFactory.js');

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

function TestTransportFactory(){
    ControlTransportFactorySpi.call(this, "test");
}

TestTransportFactory.prototype = Object.create(ControlTransportFactorySpi.prototype);

TestTransportFactory.prototype.constructor = TestTransportFactory;

TestTransportFactory.prototype.connect = function(url, callback){
    return new TestTransport(url).connect(callback);
};

controlTransportFactory.registerTransportFactorySpi(new TestTransportFactory());