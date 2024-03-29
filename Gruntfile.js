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
            livereload : {
                files : [
                    '<%= paths.app %>/*.html',
                    '<%= paths.tmp %>/stylesheets/*.css',
                    '<%= paths.app %>/javascripts/**/*.js',
                    '<%= paths.tmp %>/javascripts/**/*.js',
                    '<%= paths.tmp %>/images/**/*'
                ],
                options : {
                    livereload : true,
                    spawn : false
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
        open : {
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
            html : ['<%= paths.tmp %>/*.html'],
            options : {
                dest : '<%= paths.dist %>'
            }
        },
        usemin : {
            html : ['<%= paths.dist %>/*.html'],
            options : {
                assetsDirs : ['<%= paths.dist %>'],
                root : '<%= paths.tmp %>',
                dirs : ['<%= paths.dist %>']
            }
        },
        uglify : {
            requirejs : {
                files : {
                    '<%= paths.dist %>/components/requirejs/require.js' : [
                        '<%= paths.dist %>/components/requirejs/require.js'
                    ]
                }
            }
        },
        react : {
            server : {
                files : [
                    {
                        expand : true,
                        cwd : '<%= paths.app %>/javascripts',
                        src : ['**/*.jsx'],
                        dest : '<%= paths.tmp %>/javascripts',
                        ext : '.js'
                    }
                ]
            },
            dist : {
                files : [
                    {
                        expand : true,
                        cwd : '<%= paths.app %>/javascripts',
                        src : ['**/*.jsx'],
                        dest : '<%= paths.dist %>/javascripts',
                        ext : '.js'
                    }
                ]
            }
        },
        htmlmin : {
            dist : {
                files : [{
                    expand : true,
                    cwd : '<%= paths.tmp %>',
                    src : ['*.html'],
                    dest : '<%= paths.dist %>'
                }]
            }
        },
        copy : {
            tmp : {
                files : [{
                    expand : true,
                    dot : true,
                    cwd : '<%= paths.app %>',
                    dest : '<%= paths.tmp %>',
                    src : [
                        'stylesheets/*.*',
                        'thirdparty/Adonis/dist/adonis.css',
                        'thirdparty/Adonis/images/*.*',
                        'javascripts/**/*.js',
                        'components/**/*.*',
                        '*.html'
                    ]
                }]
            },
            dist : {
                files : [{
                    expand : true,
                    dot : true,
                    cwd : '<%= paths.app %>',
                    dest : '<%= paths.dist %>',
                    src : [
                        'thirdparty/Adonis/dist/adonis.css',
                        'thirdparty/Adonis/images/*.*',
                        'images/{,*/}*.{webp,gif,png,jpg,jpeg}',
                        'manifest.json',
                        'components/requirejs/require.js',
                        'icon*.png'
                    ]
                }]
            }
        },
        compass : {
            options : {
                sassDir : '<%= paths.app %>/compass/sass',
                cssDir : '<%= paths.app %>/stylesheets',
                imagesDir : '<%= paths.app %>/compass/images',
                relativeAssets : false,
                httpGeneratedImagesPath : '../images'
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
        rev : {
            dist : {
                files : {
                    src : [
                        '<%= paths.dist %>/javascripts/index.js',
                        '<%= paths.dist %>/javascripts/topic.js',
                        '<%= paths.dist %>/javascripts/search.js',
                        '<%= paths.dist %>/javascripts/cate.js',
                        '<%= paths.dist %>/javascripts/person.js',
                        '<%= paths.dist %>/stylesheets/index.css',
                        '<%= paths.dist %>/stylesheets/topic.css',
                        '<%= paths.dist %>/stylesheets/search.css',
                        '<%= paths.dist %>/stylesheets/cate.css',
                        '<%= paths.dist %>/stylesheets/person.css'
                    ]
                }
            }
        },
        imagemin : {
            dist : {
                files : [{
                    expand : true,
                    cwd : '<%= paths.dist %>/images',
                    src : '{,*/}*.{png,jpg,jpeg}',
                    dest : '<%= paths.dist %>/images'
                }]
            }
        },
        requirejs : {
            dist : {
                options : {
                    almond : true,
                    appDir : '<%= paths.tmp %>/javascripts',
                    dir : '<%= paths.dist %>/javascripts',
                    optimize : 'uglify',
                    baseUrl : './',
                    mainConfigFile : '<%= paths.tmp %>/javascripts/config.js',
                    uglify : {
                        toplevel : true,
                        ascii_only : false,
                        beautify : false
                    },
                    preserveLicenseComments : true,
                    useStrict : false,
                    wrap : true,
                    modules : [{
                        name : 'config',
                        include : ['$', '_', 'Backbone', 'React']
                    }, {
                        name : 'index',
                        include : ['bugsnag-2.min', 'indexMain'],
                        exclude : ['config']
                    }, {
                        name : 'cate',
                        include : ['bugsnag-2.min', 'cateMain'],
                        exclude : ['config']
                    }, {
                        name : 'topic',
                        include : ['bugsnag-2.min', 'topicMain'],
                        exclude : ['config']
                    }, {
                        name : 'search',
                        include : ['bugsnag-2.min', 'searchMain'],
                        exclude : ['config']
                    }, {
                        name : 'person',
                        include : ['bugsnag-2.min', 'personMain'],
                        exclude : ['config']
                    }]
                }
            }
        },
        compress : {
            main : {
                options : {
                    archive : 'oscar.zip'
                },
                files : [{
                    src : ['<%= paths.dist %>/**/*.*'],
                    dest : './'
                }]
            }
        },
        bump : {
            options : {
                files : ['package.json', '<%= paths.app %>/manifest.json', '<%= paths.app %>/javascripts/utilities/DoraemonInfo.js', 'bower.json'],
                updateConfigs : [],
                commit : true,
                commitMessage : 'Release v%VERSION%',
                commitFiles : ['-a'],
                createTag : true,
                tagName : 'v%VERSION%',
                tagMessage : 'Version %VERSION%',
                push : false
            }
        },
        shell : {
            buildAdonis : {
                options : {
                    stdout : true
                },
                command : ['cd app/thirdparty/Adonis', 'grunt build'].join('&&')
            }
        }
    });


    grunt.registerTask('replace', function () {

        var src = [
            pathConfig.dist + '/**/*.html'
        ];
        var fileList = grunt.file.expand(src);

        fileList.forEach(function (file) {
            var content = grunt.file.read(file, {
                encoding : 'utf-8'
            });

            var result = content.match(/<[^>]+(?:href)=\s*["']?([^"]+\.(?:css))/);
            var link = result[0] + '"/>';
            var href = result[1];

            content = content.replace(link, '<style type="text/css">' + grunt.file.read(pathConfig.dist + '/' + href, {encoding : 'utf-8'}) + '</style>')
                             .replace('src="components/requirejs/require.js">', '>' + grunt.file.read(pathConfig.dist + '/components/requirejs/require.js', {encoding : 'utf-8'}));
            grunt.file.write(file, content);
        });
    });


    grunt.registerTask('serve', [
        'shell:buildAdonis',
        'clean:server',
        'compass:server',
        'react:server',
        'connect:dev',
        'open',
        'watch'
    ]);

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'react:server',
        'shell:buildAdonis',
        'copy:tmp',
        'copy:dist',
        'requirejs:dist',
        'compass:dist',
        'useminPrepare',
        'imagemin',
        'htmlmin',
        'concat',
        'uglify',
        'rev',
        'usemin'
    ]);

    grunt.registerTask(['update'], [
        'bump-only:patch',
        'changelog',
        'bump-commit'
    ]);

    grunt.registerTask(['build:release'], [
        'bump',
        'build'
    ]);

    grunt.registerTask(['build:patch'], [
        'bump:patch',
        'build'
    ]);
};
