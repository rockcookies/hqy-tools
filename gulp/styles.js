import gulp from 'gulp';
import less from 'gulp-less';
import sourcemaps from 'gulp-sourcemaps';
import header from 'gulp-header';
import rename from 'gulp-rename';
import rev from 'gulp-rev';
import sequence from 'gulp-sequence';
import _if from 'gulp-if';
import plumber from './_gulp-plumber';
import debug from 'gulp-debug';
import cleancss from 'gulp-clean-css';

import _debug from 'debug';
import path from 'path';
import config from '../config';

const log = _debug('app:styles');

const loadPlugin = (name, options = {}) => {
	const P = require(`less-plugin-${name}`);
	return new P(options);
};

const LessPlugin = {
	cleancss: loadPlugin('clean-css', {
		compatibility: 'ie8',
		advanced: false
	}),
	autoprefix: loadPlugin('autoprefix', {
		browsers: [
			'Android 2.3',
			'Android >= 4',
			'Chrome >= 20',
			'Firefox >= 24',
			'Explorer >= 6',
			'iOS >= 6',
			'Opera >= 12',
			'Safari >= 6'
		]
	})
};

const compile = (src) => {
	const dest = config.compile_rev ? config.tmp_css : config.dist_css;

	return gulp.src(src)

	// plumber
	.pipe(plumber(log))

	// source map init
	.pipe(_if(config.complie_css_map, sourcemaps.init({
		debug: true
	})))// {loadMaps: true}

	// less compile
	.pipe(less({
		strictMath: false,
		banner: (config.compile_css_minify ? undefined : config.banner),
		paths: [
			path.resolve(config.src_styles),
			path.resolve(config.src_libs),
			path.resolve('node_modules')
		],
		modifyVars: {
			timestamp: Date.now()
		},
		plugins: [LessPlugin.autoprefix]// .concat(config.compile_css_minify ? [LessPlugin.cle] : [])
	}))

	// css minify
	.pipe(_if(config.compile_css_minify, cleancss({
		compatibility: 'ie8',
		advanced: false
	})))

	// banner
	.pipe(_if(config.compile_css_minify, header(config.banner)))

	// rename
	.pipe(rename((filepath) => {
		filepath.basename = filepath.basename.replace(/\.(pre|dev|test|prod|main)$/, '');
	}))

	// debug
	.pipe(debug({ title: 'LESS' }))

	// write source map
	.pipe(_if(config.complie_css_map, sourcemaps.write('./map')))

	// write files
	.pipe(gulp.dest(dest));
};

gulp.task('prestyles', () => compile([
	path.join(config.src_styles, '**/*.pre.less'),
	path.join(config.src_styles, `**/*.${config.globals.__ENV__}.less`)
]));

gulp.task('styles:compile', () => {
	if (gulp.config.src_styles) {
		return compile(gulp.config.src_styles);
	}

	return compile([path.join(config.src_styles, '**/*.main.less')]);
});

gulp.task('styles:rev', () =>
	gulp.src(path.join(config.tmp_css, '**/*.css'))
		// debug
		.pipe(debug({ title: 'LESS REV' }))
		// revision
		.pipe(rev())
		// write files
		.pipe(gulp.dest(config.dist_css))
		// revision manifest
		.pipe(rev.manifest())
		// write manifest files
		.pipe(gulp.dest(path.join(config.tmp_rev, 'css')))

);

gulp.task('styles:rev-sourcemap', () =>
	gulp.src(path.join(config.tmp_css, '**/*.map'))
	// write files
	.pipe(gulp.dest(config.dist_css))
);


gulp.task('styles', (next) => {
	let tasks = ['styles:compile'];

	if (config.compile_rev) {
		tasks = [...tasks, 'styles:rev', 'styles:rev-sourcemap'];
	}

	sequence(...tasks)(next);
});
