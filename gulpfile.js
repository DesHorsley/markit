/// <binding BeforeBuild='moveSnap' AfterBuild='clean,buildScripts,runUnitTests' />

// For more information on how to configure a task runner, please visit:
// https://github.com/gulpjs/gulp

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    del = require('del'),
    chutzpah = require('gulp-chutzpah'),
    tsc = require('gulp-typescript');

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
    return del(['scripts/*.js','UnitTests/*.js']);
});

gulp.task("runUnitTests", ['buildScripts'], function () {

    var opts = {
        executable: "packages\\Chutzpah.4.2.0\\tools\\chutzpah.console.exe",
        trace: true,
        vsoutput: true
    };

    gulp.src("UnitTests/markit-UnitTests.js")
        .pipe(chutzpah(opts));
});

gulp.task('buildScripts', ['clean'], function () {

    gulp.src(['scripts/**.ts', '!scripts/typings/jasmine/*.d.ts'])
        .pipe(tsc({
            outFile: 'markitEditor-build.js',
            target: 'ES5'
        }))
        .pipe(gulp.dest('scripts'));

    return gulp.src(['UnitTests/*.ts', 'scripts/**.ts'])
        .pipe(tsc({
            outFile: 'markit-UnitTests.js',
            target: 'ES5'
        }))
        .pipe(gulp.dest('UnitTests'));

});