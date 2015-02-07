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

        // Test for browser framework
        karma: {
            test: {
                configFile: 'karma.conf.js'
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    //captureFile : "tobedecided.txt"
                    quiet:false
                },
                src: ['test/**/*spec.js']
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
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webdriver');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-k3po');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // DPW - Current working setup is running the following 3 tasks in two teminals
    grunt.registerTask('runRobot', ['k3po:daemon']);
    grunt.regitserTask('startServer', ['connect']);
    grunt.regitsterTask('testBBosh', ['mochaTest']);

    // DPW - This does not work currently becuase of bugs stopping the robot, and stopping nodeunit
    grunt.registerTask('default', ['jshint', 'clean', 'k3po:start', 'connect', 'nodeunit', 'mochaTest', 'k3po:stop']);
};
