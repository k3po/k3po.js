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
                'src/*.js',
                'test/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            dist: {
                src: ['dist/']
            }
        },

        // copy all the source files we're going to combine to a temporary directory
        copy: {
            src: {
                cwd: 'src',
                src: '**',
                dest: 'dist'
            },
            utils: {
                cwd: 'bower_components/kaazing-client-javascript-util',
                src: '**',
                dest: 'dist/tmp/utils',
                expand: true
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

        // Tests for unit tests
        nodeunit: {
            tests: ['test/*test.js', 'test/*Test.js']
        },

        mochaTest: {
            testBase: {
                options: {
                    reporter: 'spec',
                    require: 'src/testFrameworks/mocha-k3po.js',
                    //captureFile : "tobedecided.txt"
                    quiet:false
                },
                src: ['test/base/*spec.js']
            },
            testMochaK3po: {
                options: {
                    reporter: 'spec',
                    ui: 'mocha-k3po',
                    require: 'src/testFrameworks/mocha-k3po.js',
                    //captureFile : "tobedecided.txt"
                    quiet:false,
                    hmm:"what"
                },
                src: ['test/testFrameworks/mocha-k3po*.js']
            }
        },

        connect: {
            server: {
                options: {
                    port: 8080,
                    hostname: 'localhost',
                    base: "test/web",
                    keepalive: false
                }
            }
        },

        browserify: {
            vendor: {
                src: ["src/base/**/*.js", "scr/testFrameworks/**/*.js", "src/web/BboshTransportFactory.js"],
                dest: 'public/k3po.js'
                //options: {
                //    require: ['jquery'],
                //    alias: {
                //        momentWrapper: './lib/moments.js'
                //    }
                //}
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webdriver');
    grunt.loadNpmTasks('grunt-k3po');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-browserify');
    // DPW - Current working setup is running the following 3 tasks in two teminals
    grunt.registerTask('runRobot', ['k3po:daemon']);
    grunt.registerTask('startServer', ['connect']);
    grunt.registerTask('testBBosh', ['mochaTest']);
    grunt.registerTask('browser', ['browserify']);
    grunt.loadNpmTasks('grunt-contrib-concat');

    // DPW - This does not work currently becuase of bugs stopping the robot, and stopping nodeunit
    // grunt.registerTask('default', ['jshint', 'clean', 'k3po:start', 'connect', 'nodeunit', 'mochaTest', 'k3po:stop']);
    grunt.registerTask('default', ['jshint', 'clean', 'mochaTest:testBase', 'k3po:start', 'mochaTest:testMochaK3po', 'browser']);
};
