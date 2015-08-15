'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverJS: ['server.js', 'routes/*.js', 'modules/*.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint']
			}
		},
		jshint: {
			all: {
				src: watchFiles.serverJS,
				options: {
					jshintrc: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					ext: 'js',
					watch: watchFiles.serverJS
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			secure: {
				NODE_ENV: 'secure'
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// Default task(s).
	grunt.registerTask('default', ['concurrent:default']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint']);

};
