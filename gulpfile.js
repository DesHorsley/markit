/// <binding BeforeBuild='moveSnap' AfterBuild='buildScripts' />

// For more information on how to configure a task runner, please visit:
// https://github.com/gulpjs/gulp

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    del = require('del'),
    chutzpah = require('gulp-chutzpah');

var paths = {
    snap: "packages/Snap.svg.js.0.4.1/content/Scripts/snap/",
    snapDeployFolder: "scripts/snap"
};

var snapFiles = [
   paths.snap + 'snap.svg-min.js',
   paths.snap + 'snap.svg.js'
];

gulp.task('moveSnap', function () {
    return gulp.src(snapFiles)
        .pipe(gulp.dest(paths.snapDeployFolder));
});

gulp.task('clean', function () {
    return del(['scripts/*-build.js']);
});

gulp.task('buildScripts', ['clean'], function () {
    return gulp.src(['scripts/*.js', '!scripts/*-build.js'])
    .pipe(concat('markitEditor-build.js'))
    .pipe(gulp.dest('scripts/'));
});

gulp.task("runUnitTests", [], function () {

    var opts = {
        executable: "packages\\Chutzpah.4.2.0\\tools\\chutzpah.console.exe",
        trace: true,
        vsoutput: true
    };

    gulp.src("UnitTests/*.js")
        .pipe(chutzpah(opts));
});