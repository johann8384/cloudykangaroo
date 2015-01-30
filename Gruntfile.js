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
    bower: grunt.file.readJSON('./.bowerrc'),
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'bower_components/font-awesome/css/',
          src: 'font-awesome.min.css',
          dest: 'src/public/css'
        },
        {
          expand: true,
          cwd: 'bower_components/font-awesome/fonts/',
          src: '*',
          dest: 'src/public/fonts'
        },
        {
          expand: true,
          cwd: 'bower_components/html5shiv/dist/html5shiv/',
          src: '*.min.js',
          dest: 'src/public/js'
        },
        {
          expand: true,
          cwd: 'bower_components/bootstrap-treeview/dist/',
          src: '*.min.js',
          dest: 'src/public/js'
        },
        {
          expand: true,
          cwd: 'bower_components/bootstrap-combobox/js/',
          src: '*.js',
          dest: 'src/public/js'
        },
        {
          expand: true,
          cwd: 'bower_components/bootstrap-select/',
          src: '*.min.js',
          dest: 'src/public/js'
        },
        {
          expand: true,
          cwd: 'bower_components/jquery/',
          src: '*.min.js',
          dest: 'src/public/js'
        },
          {
            expand: true,
            cwd: 'bower_components/jquery/',
            src: '*.min.map',
            dest: 'src/public/js/dist'
          },
        {
          expand: true,
          cwd: 'bower_components/bootstrap/dist/css/',
          src: '*.min.css',
          dest: 'src/public/css'
        },
        {
          expand: true,
          cwd: 'bower_components/bootstrap/dist/js/',
          src: '*.min.js',
          dest: 'src/public/js'
        },
        {
          expand: true,
          cwd: 'bower_components/bootstrap/dist/fonts/',
          src: '*',
          dest: 'src/public/fonts'
        },
        {
          expand: true,
          cwd: 'bower_components/patternfly/dist/img/',
          src: '*',
          dest: 'src/public/img'
        },
        {
          expand: true,
          cwd: 'bower_components/patternfly/dist/js/',
          src: '*.min.js',
          dest: 'src/public/js'
        },
        {
          expand: true,
          cwd: 'bower_components/patternfly/dist/fonts/',
          src: '*',
          dest: 'src/public/fonts'
        },
        {
          expand: true,
          cwd: 'bower_components/patternfly/dist/css/',
          src: '*.min.css',
          dest: 'src/public/css'
        }]
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      production: {
        files: {
          'src/public/patternfly/js/patternfly.min.js': ['bower_components/patternfly/dist/js/patternfly.js']
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
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', [
    'uglify',
    'copy'
  ]);

  grunt.registerTask('hooks', 'githooks');
  grunt.registerTask('run', ['env:development', 'execute']);
  grunt.registerTask('cov', ['env:test', 'mochacov:test', 'jshint']);
  grunt.registerTask('test', ['env:test', 'mochaTest', 'mochacov:test', 'jshint']);
  grunt.registerTask('report', ['mochacov:lcov', 'coveralls']);
  grunt.registerTask('default', ['env:development', 'mochaTest']);
};
