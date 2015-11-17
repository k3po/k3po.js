# K3PO for JavaScript (work in progress)

k3po.js is used to run [K3po Scripts](https://github.com/k3po/k3po/wiki/Scripting-Language) against JavaScript libraries in both the browser and node modules.

It consists of 

1. Transport.js abstract class that is used by Control.js to connect to the [K3po Driver](https://github.com/k3po/k3po/tree/develop/driver)
1. BBoshTransport.js, a streaming [Binary Bidirectional Streams Over HTTP transport protocol](https://github.com/k3po/k3po/tree/develop/specification/bbosh) that implements K3poControlTransport and that can be used in the browser on which to connect to the [K3po Driver](https://github.com/k3po/k3po/tree/develop/driver).
1. TcpTransportFactory.js, a node tcp implementation of Transport.js that can be used to control k3po from node
1. Control.js, a [k3po control protocol](https://github.com/k3po/k3po/tree/develop/specification/k3po.control) that is used by talk to the [K3po Driver](https://github.com/k3po/k3po/tree/develop/driver) via a K3poTransport that provides an API for starting/stopping k3po scripts
1. mocha-k3po.js, a [mocha](https://mochajs.org/) plugin that can control k3po scripts as part of the test framework

The [K3po driver](https://github.com/k3po/k3po/tree/develop/driver) is launched prior to tests via [grunt-k3po](https://github.com/k3po/grunt-k3po) plugin

### Running tests in the browser

The following outlines the logical steps to use k3po.js to test a browser javascript library 

![overview](https://raw.github.com/k3po/k3po.js/develop/design.jpg)


### Building

1. install grunt-k3po plugin (needed as it is not officiall released yet).  `npm install <directory of grunt-plugin>`
1. `npm install`
1. `grunt`
