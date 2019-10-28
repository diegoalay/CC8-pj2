var fileinclude = require('gulp-file-include'),
    gulp = require('gulp');

gulp.task('fileinclude', function(done) {
    gulp.src(['src/templates/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./'));
    done();
});

gulp.task('watch', function() {
    gulp.watch(['src/**/*.html'], gulp.series('fileinclude'));
});

gulp.task('default', gulp.series(['watch', 'fileinclude']));