# K3PO for JavaScript (work in progress)

k3po.js is used to run [K3po Scripts](https://github.com/k3po/k3po/wiki/Scripting-Language) against JavaScript libraries in both the browser and node modules.

It consists of 

1. bbosh.js, a streaming [Binary Bidirectional Streams Over HTTP transport protocol](https://github.com/k3po/k3po/tree/develop/specification/bbosh) that can be used in the browser on which to connect to the [K3po Driver](https://github.com/k3po/k3po/tree/develop/driver).
2. k3po-control.js, a [k3po control protocol](https://github.com/k3po/k3po/tree/develop/specification/k3po.control) that is used by talk to the [K3po Driver](https://github.com/k3po/k3po/tree/develop/driver)
3. jasmine-k3po.js, a [jasmine](http://jasmine.github.io/) plugin that can control k3po scripts as part of the test framework
4. mocha-k3po.js, a [mocha](https://mochajs.org/) plugin that can control k3po scripts as part of the test framework

The [K3po driver](https://github.com/k3po/k3po/tree/develop/driver) is launched prior to tests via [grunt-k3po](https://github.com/k3po/grunt-k3po) plugin

### Running tests in the browser

The following outlines the logical steps to use k3po.js to test a browser javascript library 

![overview](https://raw.github.com/k3po/k3po.js/develop/design.jpg)
