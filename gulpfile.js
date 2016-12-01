'use strict';

const del = require('del');

const sourcemaps = require('gulp-sourcemaps');
const inject = require('gulp-js-html-inject');
const stylus = require('gulp-stylus');
const gulpIf = require('gulp-if');
const gulp = require('gulp');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function() 
{
  return gulp.src('./src/styles/*.styl')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(stylus())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('./build/'));
});

gulp.task('js', function()
{
  return gulp.src('./src/js/*.js')
    .pipe(inject({
      basepath: './src/js/tpl/'
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('clean', function()
{
  return del('build');
});

gulp.task('watch', function()
{
  gulp.watch('./src/styles/*.styl', ['styles']);
  gulp.watch('./src/**/*.{js,html}', ['js']);
});

gulp.task('build', ['clean', 'styles', 'js']);
gulp.task('dev', ['build', 'watch']);
