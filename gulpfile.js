const { src, dest, watch, series, parallel } = require('gulp');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

function styles() {
  return src('src/less/main.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

function html() {
  return src('src/html/**/*.html')
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  watch('src/less/**/*.less', styles);
  watch('src/js/**/*.js', scripts);
  watch('src/html/**/*.html', html);
}

exports.default = series(
  parallel(styles, scripts, html),
  serve
);

exports.build = series(
  parallel(styles, scripts, html)
);