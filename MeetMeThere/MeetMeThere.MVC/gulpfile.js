var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-cssnano');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var connect = require('gulp-connect');
var yaml = require('gulp-yaml');
var del = require('del');

var paths = {
  sass: ['./assets/scss/**/*.scss'],
  sassMain: ['./assets/scss/main.scss'],
  controllers: [
    './app/controllers/_index.js',
    './app/controllers/**/*.js',
  ],
  services: [
    './app/services/_index.js',
    './app/services/**/*.js',
  ],
  directives: [

  ],
  types: [
    './app/types/user/user.proto.js',
    './app/types/user/anonuser.proto.js'
  ],
  i18n: ['assets/i18n/**/*.yaml'],
  app: [
    './build/types.js',
    './build/services.js',
    './build/directives.js',
    './build/controllers.js',
    './app/app.js'
  ]
};

gulp.task('default', ['clean', 'build:dev']);

gulp.task('clean', function(done) {
  del.sync('./build/*.js');
  done();
});

gulp.task('connect', function() {
  connect.server({
    root: ['./'],
    port: 9090,
    fallback: './app/index.html'
  });
});

gulp.task('build:dev', ['sass', /*'enums',*/ 'types', 'controllers', 'services', /*'directives'*/], function(done) {
  gulp.src(paths.app)
    .pipe(sourcemaps.init())
    .pipe(concat('mmt.app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'))
    .on('end', done);
});

gulp.task('build:prod', ['sassmin', /*'enums',*/ 'types', 'controllers', 'services', /*'directives'*/], function(done) {
  gulp.src(paths.app)
    .pipe(sourcemaps.init())
    .pipe(concat('mmt.app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'))
    .on('end', done);
});

function buildjs(src, out, done) {
  gulp.src(src)
    .pipe(concat(out))
    //.pipe(ngAnnotate())
    //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'))
    .on('end', done);
}

gulp.task('controllers', function(done) {
  buildjs(paths.controllers, 'controllers.js', done);
});

gulp.task('services', function(done) {
  buildjs(paths.services, 'services.js', done);
});

gulp.task('js-adt', function(done) {
  buildjs(paths.jsadt, 'js-adt.js', done);
});

gulp.task('directives', function(done) {
  buildjs(paths.directives, 'directives.js', done);
});

gulp.task('types', function(done) {
  buildjs(paths.types, 'types.js', done);
});


gulp.task('i18n', function(done) {
  gulp.src(paths.i18n)
    .pipe(sourcemaps.init())
    .pipe(yaml({ space: 2 }))
    .pipe(sourcemaps.write())
    .pipe(rename({ extname: '.json' }))
    .pipe(gulp.dest('assets/i18n/'))
    .on('end', done);
});

gulp.task('sassmin', function(done) {
  gulp.src(paths.sassMain)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./assets/css/'))
    .on('end', done);
});

gulp.task('sass', function(done) {
  gulp.src(paths.sassMain)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(rename({ extname: '.css' }))
    .pipe(gulp.dest('./assets/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.controllers, ['controllers']);
  gulp.watch(paths.services, ['services']);
  gulp.watch(paths.directives, ['directives']);
});
