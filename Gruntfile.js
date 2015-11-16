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
                    captureFile: "build/testMochaK3po.txt",
                },
                src: ['test/testFrameworks/mocha-k3po*.js']
            },
            testMochaK3poBrowserSupport: {
                options: {
                    reporter: 'spec',
                    ui: 'mocha-k3po',
                    require: 'lib/testFrameworks/mocha-k3po.js',
                    captureFile: "build/testMochaK3po.txt",
                    browser: {
                        desiredCapabilities: {
                            browserName: 'firefox'
                        }
                    }
                },
                src: ['test/testFrameworks/mocha-browser-k3po*.js']
            }
        },

        webdriver: {
            test: {
                configFile: './wdio.conf.js'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webdriver');
    grunt.loadNpmTasks('grunt-k3po');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('runRobot', ['k3po:daemon']);
    grunt.registerTask('startServer', ['connect']);
    grunt.loadNpmTasks('grunt-webdriver');

    // DPW - This does not work currently becuase of bugs stopping the robot, and stopping nodeunit
    grunt.registerTask('default', ['clean', 'jshint', 'mochaTest:testBase', 'k3po:start', 'mochaTest:testMochaK3po', 'mochaTest:testMochaK3poBrowserSupport']);
    //grunt.registerTask('default', ['clean', 'jshint', 'mochaTest:testBase', 'k3po:start', 'mochaTest:testMochaK3poBrowserSupport']);
};
