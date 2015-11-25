function NoopBrowserRunner() {
}

NoopBrowserRunner.prototype._noop = function () {
    return new Promise(function (fulfill) {
        fulfill();
    });
};

NoopBrowserRunner.prototype.terminate = NoopBrowserRunner.prototype._noop;

NoopBrowserRunner.prototype.init = NoopBrowserRunner.prototype._noop;

NoopBrowserRunner.prototype.loadOrigin = NoopBrowserRunner.prototype._noop;

NoopBrowserRunner.prototype.run = function (fn) {
    return new Promise(function (fulfill, reject) {
        try {
            fn(fulfill);
        } catch (e) {
            reject(e);
        }
    });
};

NoopBrowserRunner.prototype.getExceptions = function () {
    return [];
};

NoopBrowserRunner.prototype.proxy = function (fn, done) {
    fn(done);
};

NoopBrowserRunner.prototype.getOrigin = function () {
    return null;
};

module.exports = NoopBrowserRunner;