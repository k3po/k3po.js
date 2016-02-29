[![Build Status][build-status-image]][build-status]
[![Sauce Test Status][sauce-test-status-image]][sauce-test-status]

[![Sauce Test Status][sauce-browser-status-image]][sauce-browser-status]

[build-status-image]: https://travis-ci.org/k3po/k3po.js.svg?branch=develop
[build-status]: https://travis-ci.org/k3po/k3po.js
[sauce-test-status-image]: https://saucelabs.com/buildstatus/kaazing-build
[sauce-test-status]: https://saucelabs.com/u/kaazing-build
[sauce-browser-status-image]: https://saucelabs.com/browser-matrix/kaazing-build.svg?auth=e649d1664332b5284759585f345aa3e4
[sauce-browser-status]: https://saucelabs.com/u/kaazing-build

# K3PO for JavaScript

k3po.js is used to run [K3po Scripts](https://github.com/k3po/k3po/wiki/Scripting-Language) against JavaScript libraries in both the browser and node modules.

### It consists of 


1. Control Transport Factory which provides communication protocol for contacting k3po driver
1. Control.js, a [k3po control protocol](https://github.com/k3po/k3po/tree/develop/specification/k3po.control) that is used by talk to the [K3po Driver](https://github.com/k3po/k3po/tree/develop/driver) via a Transport that provides an API for starting/stopping k3po scripts
1. BrowserRunner, which provides a mechanism for running javascript test functions in a browser 
1. mocha-k3po.js, a [mocha](https://mochajs.org/) plugin that can control k3po scripts as part of the test framework, and run them in browser or locally via configuration

The [K3po driver](https://github.com/k3po/k3po/tree/develop/driver) is launched prior to tests via [grunt-k3po](https://github.com/k3po/grunt-k3po) plugin

### Examples

Test code is written using a mocha extension
```javascript

![overview](https://raw.github.com/k3po/k3po.js/develop/design.jpg)


### Building

1. install grunt-k3po plugin (needed as it is not officiall released yet).  `npm install <directory of grunt-plugin>`
=======
var chai = require('chai');
var WebSocket = require('websocket').w3cwebsocket;

describe('WsClient', function () {

    // configure k3po settings, such as script root on where to load scripts
    k3poConfig.scriptRoot('org/kaazing/specification/utils');
    
    // configure browser settings, such as origin, and resource libraries to load, here it
    // is chai, which is used as an assert in the test
    browserConfig.origin('http://localhost:8080').addResource("http://chaijs.com/chai.js");

    // everything inside function will be executed in the runtime environment, which can be a browser
    it('full.feature.test/server', function (done) {

        var echoText = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345";
        var ws = new WebSocket("ws://localhost:8080/echo");
        ws.onopen = function () {
            k3po.notify("CLIENT_READY_TO_READ");
            k3po.await("SERVER_READY_TO_READ").then(function () {
                ws.send(echoText);
            });
        };

        ws.onmessage = function (event) {
            chai.assert.equal(event.data, echoText);
            ws.close();
        };

        ws.onclose = ws.onerror = function () {
            done();
        };
    });
}

```

Configuration via Grunt
```javascript
// configure k3po driver to run prior to tests
  k3po: {
      start: {
          options: {
              goal: "start"
          }
      },
      stop: {
          options: {
              goal: "stop"
          }
      },
      daemon: {
          options: {
              goal: "start",
              daemon: false
          }
      }
  },
  
  // configure mocha to run using mocka-k3po extension
  
  mochaTest: {
  
  // configure to run in node
  testMochaK3po: {
    options: {
            reporter: 'spec',
            ui: 'mocha-k3po',
            require: 'lib/testFrameworks/mocha-k3po.js',
            captureFile: "build/testMochaK3po.txt"
        },
        src: ['test/testFrameworks/mocha-k3po*.js']
    },
    
  // configure to run in browser
    testMochaK3poBrowserSupport: {
        options: {
            reporter: 'spec',
            ui: 'mocha-k3po',
            require: 'lib/testFrameworks/mocha-k3po.js',
            captureFile: "build/testMochaK3po.txt",
            browser: {
                desiredCapabilities: {
                    // browser capabilities are documented at http://webdriver.io/
                    browserName: 'firefox'
                }
            }
        },
        src: ['test/testFrameworks/mocha-k3po*.js']
    }
  }
  
  // Note: due to mocha bug, tests can't be ran twice in a row via grunt due to global state that is not cleaned, 
  // so you will need multiple grunt profiles
    grunt.registerTask('default', ['k3po:start', 'mochaTest:testMochaK3po']);
    grunt.registerTask('firefox', ['k3po:start', 'mochaTest:testMochaK3poBrowserSupport']);

```

### Building

1. `npm install`
1. `grunt`

### Debugging the browser

By default the browser closes after the test, in case of test failures you can pass the debug flag to the browser
configuration as shown to keep it open.  This allows access to the browser javascript console.

```JavaScript
browser: {
    desiredCapabilities: {
        browserName: 'firefox'
    },
    debug: true
}

```

