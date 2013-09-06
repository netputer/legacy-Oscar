'use strict';

var lrSnippet = require('connect-livereload')();

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var pathConfig = {
        app : 'app',
        dist : 'dist',
        tmp : '.tmp'
    };

    grunt.initConfig({
        paths : pathConfig,
        watch : {
            compass : {
                files : ['<%= paths.app %>/{,*/}*/{,*/}*.{scss,png}'],
                tasks : ['compass:server']
            },
            livereload: {
                files: [
                    '<%= paths.app %>/*.html',
                    '<%= paths.tmp %>/stylesheets/*.css',
                    '<%= paths.app %>/javascripts/**/*.js',
                    '<%= paths.tmp %>/javascripts/**/*.js',
                    '<%= paths.tmp %>/images/**/*'
                ],
                options : {
                    livereload : true
                }
            },
            react : {
                files : ['<%= paths.app %>/{,*/}*/{,*/}*.jsx'],
                tasks : ['react:server']
            }
        },
        connect : {
            options : {
                port : 9999,
                hostname : '0.0.0.0'
            },
            dev : {
                options : {
                    middleware : function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, pathConfig.app)
                        ];
                    }
                }
            }
        },
        open: {
            server : {
                path : 'http://127.0.0.1:<%= connect.options.port %>',
                app : 'Google Chrome Canary'
            }
        },
        clean : {
            dist : ['<%= paths.tmp %>', '<%= paths.dist %>'],
            server : '<%= paths.tmp %>'
        },
        useminPrepare : {
            html : ['<%= paths.app %>/*.html'],
            options : {
                dest : '<%= paths.dist %>'
            }
        },
        usemin: {
            html : ['<%= paths.app %>/*.html'],
            options : {
                dirs : ['<%= paths.dist %>']
            }
        },
        react : {
            options : {
                extension : 'jsx'
            },
            server : {
                files: {
                    '<%= paths.tmp %>/javascripts/' : '<%= paths.app %>/javascripts/'
                }
            },
            dist : {
                files: {
                    '<%= paths.dist %>/javascripts/' : '<%= paths.app %>/javascripts/'
                }
            }
        },
        htmlmin : {
            dist : {
                files : [{
                    expand : true,
                    cwd : '<%= paths.app %>',
                    src : ['*.html'],
                    dest : '<%= paths.dist %>'
                }]
            }
        },
        copy : {
            dist : {
                files : [{
                    expand : true,
                    dot : true,
                    cwd : '<%= paths.app %>',
                    dest : '<%= paths.dist %>',
                    src : [
                        'images/{,*/}*.{webp,gif,png,jpg,jpeg}'
                    ]
                }]
            }
        },
        compass : {
            options : {
                sassDir : '<%= paths.app %>/sass',
                imagesDir : '<%= paths.app %>/sprites',
                relativeAssets : false,
                httpGeneratedImagesPath: '../images'
            },
            dist : {
                options : {
                    cssDir : '<%= paths.dist %>/stylesheets',
                    generatedImagesDir : '<%= paths.dist %>/images',
                    outputStyle : 'compressed'
                }
            },
            server : {
                options : {
                    cssDir : '<%= paths.tmp %>/stylesheets',
                    generatedImagesDir : '<%= paths.tmp %>/images',
                    debugInfo : true
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= paths.dist %>/javascripts/{,*/}*.js',
                        '<%= paths.dist %>/stylesheets/{,*/}*.css'
                    ]
                }
            }
        }
    });

    grunt.registerTask('server', [
        'clean:server',
        'compass:server',
        'react:server',
        'connect:dev',
        'open',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:dist'
        // 'useminPrepare',
        // 'imagemin',
        // 'copy',
        // 'htmlmin',
        // 'concat',
        // 'uglify',
        // 'requirejs:dist',
        // 'usemin'
    ]);
};
