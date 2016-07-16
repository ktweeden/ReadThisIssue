module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-express-server');


  grunt.initConfig({

    sass: {
      options: {
        sourcemap: 'none'
      },
      dev: {
        files: [{
          expand: true,
          cwd: 'client/scss',
          src: ['*.scss'],
          dest: 'static/css',
          ext: '.css'
        }]
      }
    },

    watch: {
      css: {
        files: ['client/scss/**/**.scss'],
        tasks: ['css'],
        options: {
          atBegin: true,
          interrupt: true
        }
      },

      express: {
        files:  [ 'client/templates/**/**.njk', 'server/**/**.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          atBegin: true,
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
          //require('cssnano')() // minify the result
        ]
      },

      compile: {
        src: 'static/css/**/*.css'
      }
    },


    express: {
      dev: {
        options: {
          script: 'server/main.js'
        }
      },
    }


  });

  grunt.registerTask('default', ['watch:css']);
  grunt.registerTask('server', ['watch:express']);
  grunt.registerTask('css', ['sass:dev', 'postcss:compile']);

};
