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


gulp.task('stylesheets', function () {
  let processors = [
    autoprefixer({browsers: ['last 4 version']})
  ];

  del.sync('./.build/stylesheets');

  return gulp.src(CSS_BUILD + '/builder.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('./.build/stylesheets/'));
});

gulp.task('scripts', (done) => {
  glob(JS_BUILD + '/main-**.js', (err, files) => {
    if(err) done(err);

    del.sync('./.build/scripts');

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

gulp.task('assets', (done) => {
  del.sync('./.build/assets');

  return gulp.src(SRC_DIR + 'assets/**/*')
    .pipe(gulp.dest('./.build/'));
})

gulp.task('extras', (done) => {
  del.sync('./.build/extras');

  return gulp.src(SRC_DIR + 'extras/*/*')
    .pipe(gulp.dest('./.build/'));
});

gulp.task('templates', () => {
  del.sync('./.build/*.html');
  return gulp.src('./src/templates/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./.build/'));
});

gulp.task('build', ['stylesheets', 'templates', 'scripts', 'extras', 'assets']);

gulp.task('dev', ['build'], () => {
  let server = gls.static(['.build/','./src/assets/'], 3000);
  server.start();

  gulp.watch(JS_BUILD + '/**/*.js', ['scripts']);
  gulp.watch(CSS_BUILD + '/*/*.scss', ['stylesheets']);
  gulp.watch('./src/templates/*.jade', ['templates']);

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

gulp.task('deploy', ['build'], function() {
  return gulp.src('./.build/**/*')
   .pipe(ghPages());
});