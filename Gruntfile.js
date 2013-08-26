'use strict';

var LIVERELOAD_PORT = 35729;

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
                files : ['<%= paths.app %>/compass/{,*/}*.{scss,sass,png}', '<%= paths.app %>/thirdparty/Adonis/{,*/}*/{,*/}*.{scss,sass,png}'],
                tasks : ['compass']
            },
            livereload: {
                files: [
                    '<%= paths.app %>{,*/}*/*.html',
                    '<%= paths.app %>/stylesheets/*.css',
                    '<%= paths.app %>/javascripts/{,*/}*/{,*/}*.js',
                    '<%= paths.app %>/images/{,*/}*/{,*/}*.{png,jpg,jpeg,gif,webp}'
                ],
                options : {
                    livereload : LIVERELOAD_PORT
                },
                tasks : ['livereload']
            },
            react : {
                files : ['<%= paths.app %>/{,*/}*/{,*/}*.jsx'],
                tasks : ['react']
            }
        },
        clean : {
            dist : ['<%= paths.tmp %>', '<%= paths.dist %>'],
            server : '<%= paths.tmp %>'
        },
        useminPrepare : {
            html : ['<%= paths.app %>/*.html'],
            css : ['<%= paths.app %>/stylesheets/*.css'],
            options : {
                dest : '<%= paths.dist %>'
            }
        },
        usemin: {
            html : ['<%= paths.app %>/*.html'],
            css : ['<%= paths.app %>/stylesheets/*.css'],
            options : {
                dirs : ['temp', 'dist']
            }
        },
        react : {
            options : {
                extension : 'jsx'
            },
            app : {
                files: {
                    '<%= paths.app %>/javascripts/' : '<%= paths.app %>/jsx-src/'
                }
            }
        },
        compass : {
            options : {
                sassDir : '<%= paths.app %>/compass',
                cssDir : '<%= paths.app %>/stylesheets',
                imagesDir : '<%= paths.app %>/compass/images',
                generatedImagesDir : '<%= paths.app %>/images',
                relativeAssets : true
            },
            dist : {
                options : {
                    outputStyle: 'compressed'
                }
            },
            server : {
                options : {
                    debugInfo: true
                }
            }
        }
    });

    grunt.registerTask('server', [
        'clean:server',
        'compass:server',
        'watch',
        'livereload-start'
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
