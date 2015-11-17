var webdriverio = require('webdriverio');

function BrowserRunner(options) {
    this.options = options;
    this.enabled = (true && options);
    this.remote = null;
}

function initBrowserRPC(done){
    function K3poRunner(){
        this.fnToCallsMap = [];
    }


    done();
}

BrowserRunner.prototype.isEnabled = function(){
    return this.enabled;
};

BrowserRunner.prototype.init = function (origin, done) {
    if (this.enabled) {
        this.remote = webdriverio
            .remote(this.options);
        this.remote
            .init()
            //._url('http://www.google.com')
            // TODO, load origin and any lib under test
            .then(function(){
                done();
            });
    } else {
        done();
    }
};

BrowserRunner.prototype.terminate = function (done) {
    var debug = true;
    if (this.enabled && !debug) {
        this.remote.end().then(function () {
            done();
        });
    } else {
        done();
    }
};

module.exports = BrowserRunner;

