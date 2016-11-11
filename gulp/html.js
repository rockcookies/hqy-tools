import gulp from 'gulp';
import revCollector from 'gulp-rev-collector';
import debug from 'gulp-debug';
import _debug from 'debug';
import _if from 'gulp-if';
import minifyHtml from 'gulp-minify-html';
import path from 'path';
import plumber from './_gulp-plumber';

import ejs from './_gulp-ejs';
import config from '../config';

const log = _debug('app:html');


gulp.task('html', () => {
	let src = path.join(config.src_html, '**/*.html');

	// rev files
	if (config.compile_rev) {
		src = [path.join(config.tmp_rev, '**/*.json'), src];
	}

	return gulp.src(src)

	// plumber
	.pipe(plumber(log))

	// ejs
	.pipe(ejs(config.ejs.options, {
		basePath: config.src_html,
		destPath: config.dist_html,
		rootPath: config.dist_root,
		ext: '.html'
	}))

	// debug
	.pipe(debug({ title: 'HTML' }))

	// resolve rev manifest
	.pipe(_if(config.compile_rev, revCollector({
		replaceReved: true
	})))

	// minify
	.pipe(_if(config.compile_html_minify, minifyHtml({
		empty: true,
		spare: true,
		quotes: true
	})))

	// write file
	.pipe(gulp.dest(config.dist_html));
});
