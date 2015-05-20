module.exports = function(grunt) {

  var DEBUG = !!grunt.option("debug");
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build: {
        files: [
          {expand:true, flatten:true, src: ['src/noinfopath-google.js'], dest: 'dist/', isFile: true}
        ]
      }
    },
    watch: {
        dev: {
          files: ['src/*.*'],
          tasks: ['documentation'],
          options: {
            livereload: true
          }
        }
    },
    karma: {
      unit: {
        configFile: "karma.conf.js"
      },
        continuous: {
            configFile: 'karma.conf.js',
            singleRun: true,
            browsers: ['PhantomJS']
        }
    },
    bumpup: {
            file: 'package.json'
    },
    version: {
      options: {
        prefix: '@version\\s*'
      },
      defaults: {
        src: ['src/noinfopath-google.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-version');

  //Default task(s).
  grunt.registerTask('build', ['karma:continuous','bumpup','version', 'copy:build']);
};