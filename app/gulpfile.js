var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            open: true,
            fallback : 'index.html',
            host : '127.0.0.1',
            port : 8000
        }));
});