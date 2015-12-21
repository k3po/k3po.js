// This file is loaded by the browser, so these are fake variables so js hint errors aren't thrown
var RemoteScriptRunner;
var document;
var window;

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

        var _this = this;

        // Catch all exceptions and throw error (normally, these are asserts)
        window.onerror = function myErrorHandler(errorMsg) {
            _this._cmdQueue.push('{ "type" : "EXCEPTION", "message" : "' + errorMsg + '"}');
        };
    };

    RemoteScriptRunner.prototype.prepare = function () {
        throw new Error("prepare(script) is an internal API and is not meant to be called from test code");
    };

    RemoteScriptRunner.prototype.abort = function () {
        throw new Error("abort() is an internal API and is not meant to be called from test code");
    };

    RemoteScriptRunner.prototype.dispose = function () {
        throw new Error("dispose() is an internal API and is not meant to be called from test code");
    };


    RemoteScriptRunner.prototype.start = function () {
        var _this = this;
        this._cmdQueue.push('{ "type" : "STARTED"}');
        return new Promise(function (fulfill, reject) {
            try {
                _this._on("STARTED", function () {
                    fulfill();
                });
            } catch (err) {
                reject(err);
            }
        });
    };

    RemoteScriptRunner.prototype.notify = function (barrier) {
        this._cmdQueue.push('{ "type" : "NOTIFY", "barrier" : "' + barrier + '"}');
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
        this._cmdQueue.push('{ "type" : "AWAIT", "barrier" : "' + barrier + '"}');
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
        this._cmdQueue.push('{ "type" : "FINISH"}');
        return new Promise(function (fulfill, reject) {
            try {
                _this._on("FINISHED", function () {
                    fulfill();
                });
            } catch (err) {
                reject(err);
            }
        });

    };

    RemoteScriptRunner.prototype.testDone = function () {
        this._cmdQueue.push('{ "type" : "TEST_DONE"}');
    };

    RemoteScriptRunner.prototype._on = function (event, listener) {
        var arrayOfListeners = this._eventListenerMap[event];
        if (!arrayOfListeners) {
            arrayOfListeners = [];
        }
        arrayOfListeners.push(listener);
        this._eventListenerMap[event] = arrayOfListeners;

        var alreadyFiredEvent = this._eventAlreadyFiredEventMap[event];
        if (alreadyFiredEvent) {
            listener(alreadyFiredEvent);
        }
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

    RemoteScriptRunner.prototype.nextCommand = function () {
        if (this._cmdQueue.length > 0) {
            return this._cmdQueue.shift();
        }
        return null;
    };

    /**
     * Fires an event
     * @param event: event name
     * @param arg: an optional arg (needed for NOTIFIED) in future will support multiple args as needed
     */
    RemoteScriptRunner.prototype.eventFired = function (event) {
        event = JSON.parse(event);
        var arg = null;
        var type = event.type;

        switch (type) {
            case "NOTIFIED":
                arg = event.barrier;
                break;
            default:
                arg = "DUMMY";
                break;
        }
        k3po._eventAlreadyFiredEventMap[type] = arg;

        var arrayOfListeners = k3po._eventListenerMap[type];
        if (arrayOfListeners) {
            for (var i = 0; i < arrayOfListeners.length; i++) {
                arrayOfListeners[i](arg);
            }
        }
    };
};
