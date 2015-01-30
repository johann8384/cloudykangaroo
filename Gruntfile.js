module.exports = function(grunt) {
  grunt.initConfig({
    githooks: {
      all: {
        'pre-commit': 'test'
      }
    },
    coveralls: {
      options: {
        force: true
      },
      coveralls: {
        src: 'lcov.info'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/app.js', 'src/routes/**/*.js', 'src/lib/**/*.js', 'src/public/javasripts/newTicketWizard.js', 'src/public/javascripts/sensu-helper.js', 'src/public/javascripts/puppet_gauges.js' ]
    },
    env : {
      test : {
        USE_NOCK: 'true',
        NODE_ENV : 'test',
        MGMT_DOMAIN: '.unittest.us',
        CREDS_CLASS: './config/system-dev-credentials',
        CRM_CLASS: 'cloudy-localsmith',
        MON_CLASS: './lib/mockMonitoring',
        REDIS_CLASS: 'fakeredis'
      },
      development : {
        USE_NOCK: 'true',
        NODE_ENV : 'development',
        MGMT_DOMAIN: '.unittest.us',
        CREDS_CLASS: './config/system-dev-credentials',
        CRM_CLASS: 'cloudy-localsmith',
        MON_CLASS: './lib/mockMonitoring',
        REDIS_CLASS: 'fakeredis'
      }
    },
    mochacov: {
      test: {
        options: {
          reporter: 'travis-cov',
          files: 'test/**/*.js',
          src: ['test/**/*.js']
        },
        'pattern': [
          'src'
        ],
        'data-cover-never': 'node_modules'
      },
      lcov: {
        options: {
          reporter: 'mocha-lcov-reporter',
          files: 'test/**/*.js',
          src: ['test/**/*.js']
        },
        'pattern': [
          'src'
        ],
        'data-cover-never': 'node_modules'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: 1000
        },
        src: ['test/**/*.js']
      }
    },
    bowercopy: {
      options: {
        srcPrefix: 'bower_components'
      },
      scripts: {
        options: {
          destPrefix: 'src/public/js/vendor'
        },
        files: {
          'jquery/jquery.js': 'jquery/jquery.js',
          'angular/angular.js': 'angular/angular.js',
          'react/react.js': 'react/react.js'
        }
      }
    },
    less: {
      development: {
        files: {
          'src/public/patternfly/css/patternfly.css': 'src/public/components/patternfly/less/patternfly.less'
        },
        options: {
          paths: ['less/']
        }
      },
      production: {
        files: {
          'src/public/patternfly/css/patternfly.min.css': 'src/public/components/patternfly/less/patternfly.less'
        },
        options: {
          cleancss: true,
          paths: ['less/']
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      production: {
        files: {
          'src/public/patternfly/js/patternfly.min.js': ['src/public/components/patternfly/dist/js/patternfly.js']
        }
      }
    },
    execute: {
        target: {
            src: ['src/app.js']
        }
    }
  });
  
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-blanket');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('build', [
    'less',
    'uglify'
  ]);
  grunt.registerTask('hooks', 'githooks');
  grunt.registerTask('run', ['env:development', 'execute']);
  grunt.registerTask('cov', ['env:test', 'mochacov:test', 'jshint']);
  grunt.registerTask('test', ['env:test', 'mochaTest', 'mochacov:test', 'jshint']);
  grunt.registerTask('report', ['mochacov:lcov', 'coveralls']);
  grunt.registerTask('default', ['env:development', 'mochaTest']);
};
