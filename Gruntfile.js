/*
 * k3po.js
 * https://github.com/kaazing/k3po.js
 *
 * Copyright (c) 2014 Kaazing
 * Licensed under the APACHE 2 license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'test/**/*.js',
                'lib/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            dist: {
                src: ['build/']
            }
        },

        k3po: {
            start: {
                options: {
                    goal: "start",
                    scripts: "test/scripts"
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
                    scripts: "test/scripts",
                    daemon: false
                }
            }
        },

        mochaTest: {
            testBase: {
                options: {
                    reporter: 'spec',
                    require: 'lib/testFrameworks/mocha-k3po.js',
                    captureFile: "build/mochaTest.txt",
                    quiet: false
                },
                src: ['test/base/*spec.js']
            },
            testMochaK3po: {
                options: {
                    reporter: 'spec',
                    ui: 'mocha-k3po',
                    require: 'lib/testFrameworks/mocha-k3po.js',
                    captureFile: "build/testMochaK3po.txt"
                },
                src: ['test/testFrameworks/mocha-k3po*.js']
            },
            testMochaK3poLocalBrowserSupport: {
                options: {
                    reporter: 'spec',
                    ui: 'mocha-k3po',
                    require: 'lib/testFrameworks/mocha-k3po.js',
                    captureFile: "build/testMochaK3po.txt",
                    // timeout: 5000,
                    browser: {
                        // debug: true,
                        desiredCapabilities: {
                            browserName: 'firefox'
                        }
                    }
                },
                src: ['test/testFrameworks/mocha-k3po*.js']
            },
            testMochaK3poSauceBrowserSupport: {
                options: {
                    reporter: 'spec',
                    ui: 'mocha-k3po',
                    require: 'lib/testFrameworks/mocha-k3po.js',
                    captureFile: "build/testMochaK3po.txt",
                    timeout: 10000,
                    ignoredBrowsers : ['internet explorer 8.0', 'internet explorer 9.0'],
                    browser: {
                        // debug: true,
                        desiredCapabilities: {
                            browserName: process.env.browser,
                            platform: process.env.platform,
                            version: process.env.version,
                            deviceName: process.env.device,
                            tags: [process.env.browser,process.env.platform],
                            name: 'k3po.js spec tests on '+process.env.browser+"/"+process.env.version+"/"+process.env.platform,
                            'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
                            build: process.env.TRAVIS_BUILD_NUMBER
                        },
                    host: 'localhost',
                    port: '4445',
                    user: process.env.SAUCE_USERNAME,
                    key: process.env.SAUCE_ACCESS_KEY
                    }
                },
                src: ['test/testFrameworks/mocha-k3po*.js']
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-k3po');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('runRobot', ['k3po:daemon']);
    grunt.registerTask('default', ['clean', 'jshint', 'mochaTest:testBase', 'k3po:start', 'mochaTest:testMochaK3po']);
    // Task to run tests locally in firefox(you need to start a local selenium server beforehand)
    grunt.registerTask('localTest', ['clean', 'jshint', 'mochaTest:testBase', 'k3po:start', 'mochaTest:testMochaK3poLocalBrowserSupport']);
    // Task to run tests using SauceLabs and Travis CI
    grunt.registerTask('sauceTest', ['clean', 'jshint', 'mochaTest:testBase', 'k3po:start', 'mochaTest:testMochaK3poSauceBrowserSupport']);
};
