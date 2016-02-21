'use strict';

const autoprefixer = require('autoprefixer'),
      babel = require('babelify'),
      browserify = require('browserify'),
      gls = require('gulp-live-server'),
      del = require('del'),
      gulp = require('gulp'),
      ghPages = require('gulp-gh-pages'),
      rename = require('gulp-rename'),
      glob = require('glob'),
      jade = require('gulp-jade'),
      flatten = require('gulp-flatten'),
      postcss = require('gulp-postcss'),
      sass = require('gulp-sass'),
      source = require('vinyl-source-stream'),
      es = require('event-stream'),

      SRC_DIR = __dirname + '/src/',
      CSS_BUILD = __dirname + '/src/stylesheets',
      JS_BUILD = __dirname + '/src/scripts';


gulp.task('sass', function () {
  let processors = [
    autoprefixer({browsers: ['last 10 version']})
  ];

  return gulp.src(CSS_BUILD + '/builder.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('./.build/stylesheets/'));
});

gulp.task('build-js', (done) => {
  glob(JS_BUILD + '/main-**.js', (err, files) => {
    if(err) done(err);

    var tasks = files.map((entry) => {
      return browserify({
        entries: [entry],
        debug: true,
        })
        .transform(babel.configure({
          presets: ["es2015"]
        }))
        .bundle()
        .pipe(source(entry))
        .pipe(rename({
          extname: '.bundle.js'
        }))
        .pipe(flatten())
        .pipe(gulp.dest('./.build/scripts/'));
      });
    es.merge(tasks).on('end', done);
  })
});

gulp.task('build-assets', (done) => {
  return gulp.src(SRC_DIR + 'assets/**/*')
    .pipe(gulp.dest('./.build/'));
})

gulp.task('build-extras', (done) => {
  return gulp.src(SRC_DIR + 'extras/*')
    .pipe(flatten())
    .pipe(gulp.dest('./.build/'));
});

gulp.task('jade', () => {
  return gulp.src('./templates/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./.build/'));
});

gulp.task('build-clean', (done) => {
  return del('./.build/**/*');
});

gulp.task('dist', ['build'], function() {
  return gulp.src('./.build/**/*')
    .pipe(gulp.dest('dist/'));
});

 gulp.task('deploy', ['dist'], function() {
  return gulp.src('dist/**/*')
   .pipe(ghPages());
});


gulp.task('build', ['build-clean', 'sass', 'jade', 'build-js', 'build-extras', 'build-assets']);

gulp.task('default', ['build'], () => {
  let server = gls.static(['.build/','./src/assets/'], 3000);
  server.start();

  gulp.watch(JS_BUILD + '/**/*.js', ['build-js']);
  gulp.watch(CSS_BUILD + '/*/*.scss', ['sass']);
  gulp.watch('./templates/*.jade', ['jade']);

  gulp.watch(['./.build/**/*.html', './.build/**/*.js', './.build/**/*.css'],  (file) => {
    server.notify.apply(server, [file]);
  });

  gulp.watch(['!gulpfile.js'],  (file) => {
    server.notify.apply(server, [file]);
  });

  gulp.watch('*.html',  (file) => {
    server.notify.apply(server, [file]);
  });
})