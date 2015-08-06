"use strict"; 

module.exports = function( grunt ) { 
	grunt.initConfig({ 

		watch: {
		  scripts: {
		    files: ['src/*.js'],
		    tasks: ['uglify'],
		    options: {
		      spawn: false,
		    },
		  },
		},

		uglify: { 
			options: {
				mangle: true,
				beautify: false,
				compress: true,
				preserveComments: true
			}, 
			dist: { 
				files: { 
					'dist/jform.validate-1.1.1.min.js': [ 'src/*' ] 
				} 
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask( 'default', [ 'watch' ] ); };