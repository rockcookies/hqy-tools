import gulp from 'gulp';
import rev from 'gulp-rev';
import sequence from 'gulp-sequence';
import plumber from './_gulp-plumber';
import debug from 'gulp-debug';
import webpack from 'webpack-stream';

import _debug from 'debug';
import path from 'path';
import config from '../config';
import webpackConfig from '../build/webpack-config';

const log = _debug('app:js');

const compile = (src) => {
	const dest = config.compile_rev ? config.tmp_js : config.dist_js;

	return gulp.src(src)

	// plumber
	.pipe(plumber(log))

	// webpack
	.pipe(webpack(webpackConfig(src)))

	// write files
	.pipe(gulp.dest(dest));
};

gulp.task('js:compile', () => {
	if (gulp.config.src_js) {
		return compile(gulp.config.src_js);
	}

	return compile([path.join(config.src_js, '**/*.main.js')]);
});

gulp.task('prejs', () => compile([
	path.join(config.src_js, '**/*.pre.js'),
	path.join(config.src_js, `**/*.${config.globals.__ENV__}.js`)
]));

gulp.task('js:rev', () =>
	gulp.src(path.join(config.tmp_js, '**/*.js'))
	// revision
	.pipe(rev())
	// write files
	.pipe(gulp.dest(config.dist_js))
	// revision manifest
	.pipe(rev.manifest())
	// debug
	.pipe(debug({ title: 'JS REV' }))
	// write manifest files
	.pipe(gulp.dest(path.join(config.tmp_rev, 'js')))
);

gulp.task('js:rev-sourcemap', () =>
	gulp.src(path.join(config.tmp_js, '**/*.map'))
	// write files
	.pipe(gulp.dest(config.dist_js))
);

gulp.task('js', (next) => {
	let tasks = ['js:compile'];

	if (config.compile_rev) {
		tasks = [...tasks, 'js:rev', 'js:rev-sourcemap'];
	}

	sequence(...tasks)(next);
});
