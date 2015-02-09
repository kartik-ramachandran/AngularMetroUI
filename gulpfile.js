var angularTemplates = require('gulp-angular-templates');
gulp.task('html', function () {
    return gulp.src('template/**/*.html')
        .pipe(angularTemplates())
        .pipe(gulp.dest('./build/'));
});

https://www.npmjs.com/package/gulp-angular-templates
https://www.npmjs.com/package/gulp-angular-templatecache