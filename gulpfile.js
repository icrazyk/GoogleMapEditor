'use strict';

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const del = require('del');

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
    .pipe(gulp.dest('./build/'));
});

gulp.task('clean', function()
{
  return del('build');
});

gulp.task('watch', function()
{
  gulp.watch('./src/styles/*.styl', ['styles']);
  gulp.watch('./src/js/*.js', ['js']);
});

gulp.task('build', ['clean', 'styles', 'js']);
gulp.task('dev', ['build', 'watch']);
