import del from 'del';
import path from 'path';
import gulp from 'gulp';
import _debug from 'debug';
import config from './config';
import browserSync from 'browser-sync';
import sequence from 'gulp-sequence';
import lodash from 'lodash';
import { argv } from 'yargs';

require('./gulp/assets');
require('./gulp/styles');
require('./gulp/html');
require('./gulp/js');

gulp.config = {};

const { __DEV__ } = config.globals;

let browserInstace;

const log = _debug('app:core');

gulp.task('clean', (next) => {
	del.sync([config.dist_root, config.tmp_root]);
	next();
});

gulp.task('compile', (next) => {
	sequence(['js', 'styles', 'assets'], 'html')(next);
});

gulp.task('serve', ['watch'], (next) => {
	browserInstace = browserSync.init({
		port: config.server_port,
		startPath: config.server_index,
		server: {
			baseDir: config.dist_root,
		},
		// reloadDelay: 1000,
		notify: false
	});

	next();
});

gulp.task('watch', (next) => {
	gulp.watch(path.join(config.src_js, '**/*'), ['watch:js']);
	gulp.watch(path.join(config.src_styles, '**/*'), ['watch:styles']);
	gulp.watch(path.join(config.src_html, '**/*'), ['watch:html']);
	gulp.watch(path.join(config.src_assets, '**/*'), ['watch:assets']);
	next();
});

const reload = next => {
	if (browserInstace) {
		log('server reloading');
		browserInstace.reload();
	}
	if (next) next();
};

/* const revReload = function (next) {
	if (config.compile_rev) {
		sequence('html', () => {
			reload();
			next();
		});
	} else {
		reload();
		next();
	}
}; */

let scope;
if (__DEV__ && argv.scope) {
	scope = argv.scope.split(',');
}

gulp.task('watch:js', next => {
	if (scope) {
		const srcs = gulp.config.src_js = [];

		for (const s of scope) {
			srcs.push(path.join(config.src_js, `${s}/**/*.main.js`));
		}
	}

	sequence('js', () => {
		reload(next);
	});
});

gulp.task('watch:styles', next => {
	if (scope) {
		gulp.config.src_styles = [path.join(config.src_styles, '**/*.main.less')];

		for (const s of config.scopes) {
			if (!lodash.includes(scope, s)) {
				gulp.config.src_styles.push(`!${path.join(config.src_styles, `${s}/**/*.main.less`)}`);
			}
		}
	}

	sequence('styles', () => {
		reload(next);
	});
});

gulp.task('watch:html', ['html'], reload);

gulp.task('watch:assets', ['assets'], reload);


