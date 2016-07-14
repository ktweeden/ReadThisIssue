module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

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
        tasks: ['sass:dev'],
        options: {
          atBegin: true,
          interrupt: true
        }
      }
    }

  });

  grunt.registerTask('default', ['watch:css']);

};
