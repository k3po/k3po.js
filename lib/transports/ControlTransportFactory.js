function ControlTransportFactory() {
    this.schemeToTransportMap = {};
}

ControlTransportFactory.prototype.registerTransportFactorySpi = function (transport) {
    var scheme = transport.getScheme();
    this.schemeToTransportMap[scheme] = transport;
};

ControlTransportFactory.prototype.connect = function (url, callback) {
    var getUrlScheme = function (url) {
        return url.split(":")[0];
    };

    var scheme = getUrlScheme(url);
    var transportFactory = this.schemeToTransportMap[scheme];
    if (!transportFactory) {
        throw new Error("Could not load transport factory for scheme: " + scheme);
    }
    return transportFactory.connect(url, callback);
};

module.exports = exports = new ControlTransportFactory();
