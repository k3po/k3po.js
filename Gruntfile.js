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

        // Test for robot test framework jasmine
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec',
                jUnit: {
                    report: true,
                    savePath : "./build/reports/jasmine/",
                    useDotNotation: true,
                    consolidate: true
                }
            },
            all: ['test/']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webdriver');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-k3po');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-jasmine-node');

    // tasks
//    grunt.registerTask('test', ['k3po:start', 'jasmine_node']);
//    grunt.registerTask('browser-test', ['k3po:start', 'karma', 'k3po:stop']);
    grunt.registerTask('default', ['jshint', 'clean', 'k3po:start', 'nodeunit', 'jasmine_node', 'k3po:stop']);
//    grunt.registerTask('default', ['jshint', 'clean', 'k3po:start', 'nodeunit', 'jasmine_node', 'karma:test', 'k3po:stop']);
};
