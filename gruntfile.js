'use strict';

module.exports = function (grunt) {
    // Unified Watch Object
    var watchFiles = {
        serverViews: ['app/views/**/*.*'],
        serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
        clientViews: ['public/modules/**/views/**/*.html'],
        clientJS: ['public/js/*.js', 'public/modules/**/*![e2e]*.js'],
        clientCSS: ['public/modules/**/*.css'],
        mochaTests: ['app/tests/**/*.js'],
        e2eTests: ['public/modules/*/tests/e2e/*.js']
    };

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			},
			karma: {
                files: ['src/**/*.js', 'test/unit/**/*.js'],
                tasks: ['karma:unit:run']
            },
            e2eJS: {
                files: watchFiles.e2eTests,
                tasks: ['protractor_webdriver','protractor']
            }
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': '<%= applicationCSSFiles %>'
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverJS)
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
        ngmin: {
            production: {
                files: {
                    'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
                }
            }
        },
		concurrent: {
			default: ['nodemon', 'watch'],
			travis: ['env:test','mochaTest'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js',
				coverage: true,
				timeout: 20000
			}
		},
		karma: {
			unit: {
				configFile: './karma.conf.js'
			},
			travis: {
                configFile: './karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
		},
        protractor: {
            all: {   
                options: {
                    configFile: 'e2e.conf.js', 
                    args: {}, 
                    noColor: false,
                    keepAlive: true
                }
            }
        },
        protractor_webdriver: {
            start: {
                options: {
                    path: 'node_modules/protractor/bin/',
                    command: 'webdriver-manager start'
                }
            }
        }
	});


    // Load NPM tasks
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    grunt.option('force', false);

    // A Task for loading the configuration object
    grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function () {
        var init = require('./config/init')();
        var config = require('./config/config');

        grunt.config.set('applicationJavaScriptFiles', config.assets.js);
        grunt.config.set('applicationCSSFiles', config.assets.css);
    });

    // Default task(s).
    grunt.registerTask('default', ['lint', 'concurrent:default']);

    // Debug task.
    grunt.registerTask('debug', ['lint', 'concurrent:debug']);

    // Lint task(s).
    grunt.registerTask('lint', ['jshint', 'csslint']);

    // Build task(s).
    grunt.registerTask('build', ['lint', 'loadConfig', 'ngmin', 'uglify', 'cssmin']);

//	grunt.registerTask('test', ['env:test', 'mochaTest']);
	grunt.registerTask('travis', ['protractor_webdriver','concurrent:travis','protractor']);

    grunt.registerTask('test', ['env:test', 'karma:unit', 'protractor_webdriver', 'protractor','mochaTest']);
    grunt.registerTask('treyTest', ['env:test', 'mochaTest']);
};