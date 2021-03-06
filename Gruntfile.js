module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            all: {
                files: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
                tasks: ['test']
            },
        },

        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
            options: {
                jshintrc: '.jshintrc',
            }
        },

        jasmine_nodejs: {
            all: {
                specs: ['tests/**'],
            },
        },

        browserify: {
            dist: {
                src: [
                    'src/**/*.js',
                ],
                dest: 'dist/coquo-venenum.js',
                options: {
                    browserifyOptions: {
                        debug: false,
                        standalone: 'coquo-venenum',
                    },
                }
            },
        },

        jasmine: {
            dist: {
                src: ['dist/coquo-venenum.js'],

                options: {
                    specs: 'tests/**/*.js',
                },
            },

            debug: {
                src: ['src/**/*.js'],

                options: {
                    specs: 'tests/**/*.js',
                    keepRunner: true,
                    template: require('grunt-template-jasmine-nml'),
                },
            },

            coverage: {
                src: ['src/**/*.js'],

                options: {
                    specs: 'tests/**/*.js',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        template: require('grunt-template-jasmine-nml'),
                        templateOptions: {
                            pathmap: {
                                'src/': '.grunt/grunt-contrib-jasmine/src/',
                            }
                        },
                        coverage: 'reports/coverage/coverage.json',
                        report: [{
                            type: 'html',
                            options: {
                                dir: 'reports/coverage/html',
                            }
                        }, {
                            type: 'lcovonly',
                            options: {
                                dir: 'reports/coverage/lcov',
                            }
                        }],
                        thresholds: {
                            lines: 95,
                            statements: 95,
                            branches: 95,
                            functions: 95
                        },
                    }
                },
            },
        },

        clean: {
            dist: ['dist/*'],
        },

        uglify: {
            dist: {
                files: {
                    'dist/coquo-venenum.min.js': ['dist/coquo-venenum.js']
                }
            },
        },

        coveralls: {
            travis: {
                src: 'reports/coverage/lcov/*.info',
                options: {
                    force: true,
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.registerTask('dev', ['watch']);

    grunt.registerTask('test', [
        'jshint',
        'jasmine_nodejs',
        'jasmine:coverage',
        'dist',
        'jasmine:dist',
    ]);

    grunt.registerTask('dist', [
        'clean',
        'browserify:dist',
        'uglify:dist'
    ]);
};
