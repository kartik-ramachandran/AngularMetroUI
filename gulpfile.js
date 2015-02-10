var gulp = require('gulp');
var angularTemplates = require('gulp-angular-templates');
var concat = require('gulp-concat');

gulp.task('html', function () {
    return gulp.src('template/**/*.html')
        .pipe(angularTemplates({ module: 'ui.am.menu' }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./build/'));
});

//npm install gulp --save-dev
//npm install gulp-angular-templates --save-dev
//npm install gulp-concat --save-dev https://www.npmjs.com/package/gulp-concat

//https://www.npmjs.com/package/gulp-angular-templates
//https://www.npmjs.com/package/gulp-angular-templatecache