// This file is loaded by the browser, so these are fake variables so js hint errors aren't thrown
var RemoteScriptRunner;
var document;

/**
 * Class is loaded in the browser, note the use of node promise requires the following to be loaded
 * <script src="https://www.promisejs.org/polyfills/promise-6.1.0.js"></script>
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.min.js"></script>
 * TODO, figure out how to not infect code under test with this (next k3po.js version)
 *
 * @constructor
 */
module.exports = function () {

    RemoteScriptRunner = function RemoteScriptRunner(resources) {
        this._state = "INITIAL";
        this._cmdQueue = [];
        this._eventListenerMap = [];
        this._eventAlreadyFiredEventMap = [];
        for (var i = 0; i < resources.length; i++) {
            this.loadScript(resources[i]);
        }
    };

    RemoteScriptRunner.prototype.prepare = function () {
        throw "prepare(script) is an internal API and is not meant to be called from test code";
    };

    RemoteScriptRunner.prototype.abort = function () {
        throw "abort() is an internal API and is not meant to be called from test code";
    };

    RemoteScriptRunner.prototype.dispose = function () {
        throw "dispose() is an internal API and is not meant to be called from test code";
    };


    RemoteScriptRunner.prototype.start = function () {
        var _this = this;
        this._cmdQueue.push("START\n\n");
        return new Promise(function (fulfill, reject) {
            try {
                _this._on("STARTED", fulfill);
            } catch (err) {
                reject(err);
            }
        });
    };

    RemoteScriptRunner.prototype.notify = function (barrier) {
        this._cmdQueue.push("NOTIFY\nbarrier:" + barrier + "\n\n");
        return new Promise(function (fulfill, reject) {
            try {
                fulfill();
            } catch (err) {
                reject(err);
            }
        });
    };

    RemoteScriptRunner.prototype.await = function (barrier) {
        var _this = this;
        this._cmdQueue.push("AWAIT\nbarrier:" + barrier + "\n\n");
        return new Promise(function (fulfill, reject) {
            try {
                _this._on("NOTIFIED", function (barrierName) {
                    if (barrier === barrierName) {
                        fulfill();
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    };

    RemoteScriptRunner.prototype.finish = function () {
        var _this = this;
        this._cmdQueue.push("FINISH\n\n");
        console.log("finish: fired");
        return new Promise(function (fulfill, reject) {
            try {
                console.log("finish: register on");
                _this._on("FINISHED", fulfill);
                console.log("finish: register complete");
            } catch (err) {
                reject(err);
            }
        });

    };

    RemoteScriptRunner.prototype.testDone = function () {
        var _this = this;
        this._cmdQueue.push("TEST_DONE\n\n");
    };

    RemoteScriptRunner.prototype._on = function (event, listener) {
        console.log("On event: " + event);
        var arrayOfListeners = this._eventListenerMap[event];
        if (!arrayOfListeners) {
            arrayOfListeners = [];
        }
        arrayOfListeners.push(listener);
        this._eventListenerMap[event] = arrayOfListeners;

        var alreadyFiredEvent = this._eventAlreadyFiredEventMap[event];
        if (alreadyFiredEvent) {
            console.log("On event: already fired notifying: " + event);
            listener(alreadyFiredEvent);
            console.log("On event: already fired notified: " + event);
        }
        console.log("On event: done registering: " + event);
    };

    RemoteScriptRunner.prototype.loadScript = function (url, callback) {
        var head = document.getElementsByTagName('head')[0];
        if (!head) {
            head = document.createElement("HEAD");
            document.appendChild(head);
        }
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // There are several events for cross browser compatibility.
        //script.onreadystatechange = callback;
        //script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    };

    RemoteScriptRunner.prototype.nextCommand = function(){
        if(this._cmdQueue.length > 0){
            return this._cmdQueue.shift();
        }
        return null;
    };

    /**
     * Fires an event
     * @param event: event name
     * @param arg: an optional arg (needed for NOTIFIED) in future will support multiple args as needed
     */
    RemoteScriptRunner.prototype.eventFired = function (event, arg) {
        console.log("Event Fired: " + event);
        if (!arg) {
            arg = "DUMMY";
        }
        var arrayOfListeners = k3po._eventListenerMap[event];
        k3po._eventAlreadyFiredEventMap[event] = arg;
        if (arrayOfListeners) {
            arrayOfListeners = this._eventListenerMap[event];
            if (arrayOfListeners) {
                for (var i = 0; i < arrayOfListeners.length; i++) {
                    if (arg) {
                        arrayOfListeners[i](arg);
                    } else {
                        arrayOfListeners[i]();
                    }

                }
            }
        }
        console.log("Event Fired: notifications complete : " + event + ", with " + k3po._eventAlreadyFiredEventMap[event]);
    };


};