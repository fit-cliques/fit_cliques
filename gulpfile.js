const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
// const minifyCss = require('gulp-clean-css');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const childProcess = require('child_process');
const angularProtractor = require('gulp-angular-protractor');
const KarmaServer = require('karma').Server;

var apiFiles = ['./*.js', './lib/*.js', './models/*.js', './routes/*.js'];
var appFiles = ['./app/**/*.js'];
var testFiles = ['./test/*test.js'];
var unitFiles = ['./test/unit/**/*test.js'];
var specFiles = ['./test/integration/**/*spec.js'];

var children = [];

gulp.task('startservers:test', () => {
  process.env.PORT = 5505;
  const mongoURI = 'mongodb://localhost/fit_cliques_testDB';
  children.push(childProcess.spawn('mongod', ['--dbpath=./db']));
  children.push(childProcess.fork('server.js', [], {
    env: {
      MONGODB_URI: mongoURI,
      PORT: 5505
    }
  }));
});

gulp.task('webpack:dev', ['html:dev', 'css:dev'], () => {
  return gulp.src('app/js/entry.js')
    .pipe(webpackStream({
      devtool: 'source-map',
      output: {
        filename: 'bundle.js'
      },
      plugins: [
        new webpack.EnvironmentPlugin(['PORT'])
      ]
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('html:dev', () => {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('/build'));
});

gulp.task('sass:dev', () => {
  gulp.src('./app/**/*.scss')
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    // .pipe(minifyCss())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('./build'));
});

gulp.task('css:dev', ['sass:dev'], () => {
  return gulp.src('app/**/*.css')
    .pipe(gulp.dest('/build'));
});

gulp.task('webpack:test', () => {
  return gulp.src('test/unit/test_entry.js')
  .pipe(webpackStream({
    devtool: 'source-map',
    output: {
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.html$/,
          loader: 'html'
        }
      ]
    }
  }))
  .pipe(gulp.dest('/test'));
});

gulp.task('test:mocha', () => {
  return gulp.src(testFiles)
    .pipe(mocha());
});

gulp.task('test:karma', ['webpack:test'], (done) => {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test:protractor', ['startservers.test', 'build:dev'], () => {
  return gulp.src([specFiles])
    .pipe(angularProtractor({
      'configFile': '/test/integration/config.js',
      'debug': true,
      'autoStartStopServer': true
    }))
    .on('error', () => {
      children.forEach((child) => {
        child.kill('SIGTERM');
      });
      setTimeout(() => {
        process.env.PORT = 5555;
        gulp.start('build:dev');
      }, 1800);
    })
    .on('end', () => {
      children.forEach((child) => {
        child.kill('SIGTERM');
      });
      setTimeout(() => {
        process.env.PORT = 5555;
        gulp.start('build:dev');
      }, 1800);
    });
});

gulp.task('lint:api', () => {
  return gulp.src(apiFiles)
    .pipe(eslint('./.eslintrc.json'))
    .pipe(eslint.format());
});

gulp.task('lint:app', () => {
  return gulp.src(appFiles)
    .pipe(eslint('./.eslintrc.json'))
    .pipe(eslint.format());
});

gulp.task('lint:test', () => {
  return gulp.src(testFiles)
    .pipe(eslint('./.eslintrc.json'))
    .pipe(eslint.format());
});

gulp.task('lint:unit', () => {
  return gulp.src(unitFiles)
    .pipe(eslint('./.eslintrc.json'))
    .pipe(eslint.format());
});

gulp.task('lint:spec', () => {
  return gulp.src(specFiles)
    .pipe(eslint('./.eslintrc.json'))
    .pipe(eslint.format());
});

gulp.task('build:dev', ['webpack:dev']);
gulp.task('test', ['test:mocha']);
// gulp.task('test', ['test:mocha', 'test:karma'], () => {
//   gulp.start('test:protractor');
// });

gulp.task('lint', ['lint:api', 'lint:app', 'lint:test', 'lint:unit', 'lint:spec']);

gulp.task('default', ['lint', 'test']);
