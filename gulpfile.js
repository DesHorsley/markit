/// <binding BeforeBuild='moveSnap' />

// For more information on how to configure a task runner, please visit:
// https://github.com/gulpjs/gulp

var gulp  = require('gulp'),
    gutil = require('gulp-util');

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