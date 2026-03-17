const { src, dest, watch, series, parallel } = require('gulp');
const fileInclude = require('gulp-file-include');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fs = require('fs');
const path = require('path');

// Helper: recursively delete a folder and all its contents
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

// Clean dist/assets/images before fresh copy (prevents stale/corrupted files)
function cleanImages(cb) {
  deleteFolderRecursive('dist/assets/images');
  cb();
}

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
  return src('src/images/**/*')
    .pipe(dest('dist/assets/images'))
    .pipe(browserSync.stream());
}

function videos() {
  return src('src/video/**/*')
    .pipe(dest('dist/assets/video'))
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
  // On image changes during watch: clean then re-copy to stay in sync
  watch('src/images/**/*', series(cleanImages, images));
  watch('src/video/**/*', videos);
}

exports.default = series(
  parallel(styles, scripts, html, series(cleanImages, images), videos),
  serve
);

exports.build = series(
  parallel(styles, scripts, html, series(cleanImages, images), videos)
);