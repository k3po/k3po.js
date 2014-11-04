robot.js
========

##Required for building

* [Node.js](http://nodejs.org/)
* [Bower](http://bower.io/)
* [Grunt](http://gruntjs.com/)

##Steps to build

* Command to install all the dependencies:```npm install```
* Command to get project dependencies:```bower install```
* Command to build: ```grunt```

##Directory structure
* files: package.json, GruntFile.js, bower.json, README.md, LICENSE
* src: Source files
* demo: Demo files
* docs: Supporting documents
* test: Test files and karma config to run tests. Test can be run by using ```grunt karma``` commnd.
* dist: A distribution directory will be generated which has generated-demo and jsdoc directories.
* generated-demo: Has the complete demo package, which includes generated amqp-0-9-1.js library and demo files.
* jsdoc: JSDOC generated from
