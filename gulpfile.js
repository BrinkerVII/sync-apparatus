var gulp = require('gulp');
var clean = require('gulp-clean');
var zip = require('gulp-zip');
var packageJson = require('./electron-app/package.json');

gulp.task('clean', function() {
	gulp.src('build', {
			read: false
		})
		.pipe(clean());

	gulp.src('release', {
			read: false
		})
		.pipe(clean());

	gulp.src('dist', {
			read: false
		})
		.pipe(clean());
});

gulp.task('pack-plugin', function() {
	gulp.src('sync-apparatus-plugin/**/*')
		.pipe(zip('sync-apparatus-plugin.zip'))
		.pipe(gulp.dest('electron-app/assets'));
});

gulp.task('copy-electron', function() {
	gulp.src("./electron-app/**/*")
		.pipe(gulp.dest('./build'));
});

gulp.task('build', ['copy-electron', 'pack-plugin']);

gulp.task('rebuild', ['clean', 'build']);

gulp.task('default', ['rebuild']);
