import gulp from 'gulp';
import plumber from './_gulp-plumber';
import debug from 'gulp-debug';
import path from 'path';
import _debug from 'debug';
import config from '../config';

const log = _debug('app:assets');

gulp.task('assets', () =>
	gulp.src(path.join(config.src_assets, '**/*'))

	// plumber
	.pipe(plumber(log))

	// debug
	.pipe(debug({ title: 'ASSETS' }))

	.pipe(gulp.dest(config.dist_assets))
);
