module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        concat: {
            js: {
                src: ['js/*.js'],
                dest: 'build/js/scripts.js'
            }
      },

      watch: {
          options: {
              livereload: true
          },
          js: {
              files: ['js/**/*.js'],
              tasks: ['concat:js']
          }
      },
      clean: {
          build: ['./build']
      },

      sass: {
		dist: {
            options: {
                style: 'expanded',
                sourcemap: 'none',
    		},
			files: {
				'build/css/styles.css': 'css/**.scss'
			}
		}
	   },

      copy: {
          build: {
              files: [
                  {src: 'index.html', dest: 'build/'},
                  {src: 'css/lib/**', dest: 'build/'},
                  {src: 'js/lib/**', dest: 'build/'},
              ]
          }
      },

      express: {
          all: {
              options: {
                  port: 9000,
                  hostname: 'localhost',
                  bases: ['build'],
                  livereload: true,
                  open: true
              }
          }
      }
    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-express');

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['clean', 'copy', 'concat', 'sass', 'watch']);

    grunt.registerTask('serve', ['express', 'build']);


};
