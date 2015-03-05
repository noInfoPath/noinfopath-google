module.exports = function(grunt) {

  var DEBUG = !!grunt.option("debug");
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bumpup: {
            file: 'package.json'
        },
    gitadd: {
          task: {
            options: {
              force: false
            },
            files: {
              src: ['./']
            }
          }
        },
    gitcommit: {
        your_target: {
          options: {
            message: ''
          },

          files: {

          }
        }
      },
    gitpush: {
        your_target: {
          options: {
            remote: '',
            branch: 'master'
          }
        }
      },
    markdox : {
      target : {
        files: [{
          src: '/src/*.js',
          dest: 'README.md'
          }]
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
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-markdox');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-git');

  //Default task(s).
  grunt.registerTask('documentation', ['markdox']);
  grunt.registerTask('production', ['copy:production']);
  grunt.registerTask('development', ['copy:development']);
  grunt.registerTask('deploy', ['gitadd','gitcommit','gitpush']);
};