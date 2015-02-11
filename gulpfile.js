var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//var angularTemplates = require('gulp-angular-templates');
var templateCache = require('gulp-angular-templatecache');
var gulpSrcFiles = require('gulp-src-files');

var modules = [];
var BuildPath = './build/';
var DocPath = './docs/';
var JavaScriptSource = ['!./src/**/docs/*.js', '!./src/**/test/*.js', './src/**/*.js'];


gulp.task('BuildAngularHtmlTemplates', function () {
    gulp.src('./template/**/*.html')
            .pipe(templateCache('ui.metrobootstrap.tmpl.js', {
                module: 'ui.metrobootstrap.tmpl',
                standalone: false,
                root: 'template/',
                templateHeader: 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {',
                templateFooter: '}]);'
            }))
            .pipe(gulp.dest(BuildPath + '/js/'));
});

gulp.task('BuildCss', function () {
    gulp.src('./css/*.css')
        .pipe(gulp.dest(BuildPath + '/css/'));
});

gulp.task('BuildFonts', function () {
    gulp.src('./fonts/*.*')
        .pipe(gulp.dest(BuildPath + '/fonts/'));
});

gulp.task('BuildJavaScript', function () {
    gulp.src(JavaScriptSource)
        .pipe(concat('ui.metro.js'))
        .pipe(gulp.dest(BuildPath + '/js/'));
});

gulp.task('BuildRootModule', function () {
    var data = gulpSrcFiles(JavaScriptSource);
    var sb = 'angular.module("ui.metrobootstrap", [ "ui.metrobootstrap.tmpl", "ui.bootstrap.';
    for (var i in data) {
        modules.push(data[i].split('\\').pop().split('/').pop().split('.')[0]);
    }
    sb += modules.join('","ui.bootstrap.');
    sb += '"]);';
    require('fs').writeFile(BuildPath + '/js/rootmodule.js', sb);
});

gulp.task('FullBuild', ['BuildRootModule', 'BuildAngularHtmlTemplates', 'BuildJavaScript', 'BuildCss', 'BuildFonts']);

gulp.task('MinifyJS', ['FullBuild'], function () {
    gulp.src( BuildPath + '/js/*.js')
        .pipe(concat('ui.metro.all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(BuildPath + '/js/'));
});

gulp.task('CopyToDocs', ['MinifyJS'], function () {
    gulp.src([BuildPath + '/**/*'])
        .pipe(gulp.dest(DocPath));
});