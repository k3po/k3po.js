require("../../src/web/BboshTransportFactory.js");
require("../../src/base/BboshTransportFactory.js");
var controlTransportFactory = require('../../src/base/ControlTransportFactory.js');
//var assert = require('assert');

describe('bbossh client transport', function () {

    setScriptRoot("org/kaazing/specification/bbosh/");

    var bboshTransport;

    beforeEach(function(){
        controlTransportFactory.connect("bbosh://localhost:8181")
    });

    it("connect.echo.then.close", function () {
        k3poFinish();
    });

    it("connect.echo.then.closed", function () {
        k3poFinish();
    });

};