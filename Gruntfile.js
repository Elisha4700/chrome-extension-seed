'use strict';

var io = require('socket.io');
var sock;

module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-crx');
	grunt.loadNpmTasks('grunt-contrib-watch');

	var io = require('socket.io').listen(4700);
	io.sockets.on('connection', function (socket) {
		sock = socket;
		socket.on('my other event', function (data) {
			console.log(data);
		});
	});

	grunt.initConfig({
		crx: {
			sidebar: {
				"src": "app/",
				"dest": ".",
				"exclude": [
					".git",
					".dev",
					"node_modules",
					"sass",
					"less",
					"scss",
					"README.md",
					"*.scss",
					"*.less",
					"*.coffee",
					"*.sass-cache",
					".idea"
				],
				"privateKey": "testapp.pem"
			}
		},

		watch: {
			scripts: {
				files: ['app/manifest.json', 'app/**/*.js', 'tests/**/*.js', 'tests/*.js', 'tests/SpecRunner.html']
			}
		}
	});

	grunt.registerTask('default', ['crx']);
	grunt.registerTask('watcher', ['watch']); // if I name the job 'watch' it throws an error... something about infinite loop. guess its cuz "grunt.event.on('watch'...".
	grunt.registerTask('w', ['watch']);

	grunt.event.on('watch', function (action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
		sock.emit('news', { changedFiles: filepath });
	});
};

