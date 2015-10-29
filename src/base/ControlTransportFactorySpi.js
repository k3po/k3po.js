var ControlTransportFactorySpi = function(scheme){
    this.scheme = scheme;
};

ControlTransportFactorySpi.prototype.getScheme = function () {
    return this.scheme;
};

ControlTransportFactorySpi.prototype.connect = function (url, callback) {
    throw "connect(url, callback) not implemented"
};

exports.ControlTransportFactorySpi = ControlTransportFactorySpi;