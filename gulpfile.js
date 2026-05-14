const { src, dest, watch, series, parallel } = require('gulp');
const fileInclude = require('gulp-file-include');
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
    .pipe(dest('dist/assets/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(dest('dist/assets/js'))
    .pipe(browserSync.stream());
}

function html() {
  return src(['src/html/**/*.html', '!src/html/partials/**'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function images() {
  return src('src/images/**/*', { encoding: false })
    .pipe(dest('dist/assets/images'));
}

function videos() {
  return src('src/video/**/*', { encoding: false })
    .pipe(dest('dist/assets/video'));
}

function serve() {
  browserSync.init({
    server: { baseDir: 'dist' }
  });

  watch('src/less/**/*.less', styles);
  watch('src/js/**/*.js', scripts);
  watch('src/html/**/*.html', html);
  watch('src/images/**/*', series(images, (cb) => { browserSync.reload(); cb(); }));
  watch('src/video/**/*', series(videos, (cb) => { browserSync.reload(); cb(); }));
}

exports.default = series(
  parallel(styles, scripts, html, images, videos),
  serve
);

exports.build = parallel(styles, scripts, html, images, videos);