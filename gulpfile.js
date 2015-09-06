var gulp      = require('gulp');
var gutil     = require('gulp-util');
var bower     = require('bower');
var concat    = require('gulp-concat');
var sass      = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename    = require('gulp-rename');
var sh        = require('shelljs');
var coffee    = require('gulp-coffee');
var templateCache = require('gulp-angular-templatecache');

var paths = {
    sass: ['./scss/**/*.scss'],
    coffee: ['./src/**/*.coffee'],
    templates: ['./src/**/*.html']
};

gulp.task('default', ['sass', 'coffee', 'templates', 'watch']);

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('coffee', function (done) {
    gulp.src(paths.coffee)
        .pipe(coffee({bare: true})
            .on('error', gutil.log.bind(gutil, 'Coffee Error')))
        .pipe(concat('application.js'))
        .pipe(gulp.dest('./www/js'))
        .on('end', done)
});

gulp.task('templates', function (done) {
    gulp.src(paths.templates)
        .pipe(templateCache({standalone: true}))
        .pipe(gulp.dest('./www/js'))
        .on('end', done)
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.coffee, ['coffee']);
    gulp.watch(paths.templates, ['templates']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
