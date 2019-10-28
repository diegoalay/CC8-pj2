var fileinclude = require('gulp-file-include'),
    gulp = require('gulp');

gulp.task('include', function() {
    gulp.src(['src/templates/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./'));
});