import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import _debug from 'debug';
import fs from 'fs';
import config from '../config';

const log = _debug('app:webpack:config');

const { __PROD__ } = config.globals;

export default function (srcFiles) {
	log('Create webpack configuration.');

	const webpackConfig = {
		// cache: true,
		context: path.resolve(config.src_js),
		name: 'client',
		target: 'web',
		resolve: {
			alias: {},
			modulesDirectories: [
				path.resolve('node_modules'),
				path.resolve(config.src_libs)
			],
			root: path.resolve(config.src_js),
			extensions: ['', '.js', '.json']
		},
		module: {}
	};

	// ------------------------------------
	// Entry Points
	// ------------------------------------
	webpackConfig.entry = (() => {
		const entry = {};
		srcFiles.forEach((file) => glob.sync(file).forEach((name) => {
			let key = path.relative(config.src_js, path.resolve(name));
			let suffix;

			key = key.replace(/\.(pre|dev|test|prod|main).js$/, ($1, $2) => {
				suffix = $2;
				return '';
			});

			entry[key] = `./${key.replace(/\\/, '/')}.${suffix}.js`;
		}));

		return entry;
	})();

	// ------------------------------------
	// Bundle Output
	// ------------------------------------
	webpackConfig.output = {
		filename: '[name].js',
		path: path.resolve(config.dist_js)
		// publicPath: config.compiler_public_path
	};

	if (config.complie_js_map) {
		webpackConfig.devtool = 'source-map';
		webpackConfig.output.sourceMapFilename = '[file].map';
	}

	// ------------------------------------
	// Plugins
	// ------------------------------------
	webpackConfig.plugins = [
		new webpack.DefinePlugin(config.globals)
	];

	if (__PROD__) {
		log('Enable plugins for production (OccurenceOrder, Dedupe).');

		webpackConfig.plugins.push(
			new webpack.optimize.OccurrenceOrderPlugin(),
			new webpack.optimize.DedupePlugin()
		);
	}

	if (config.complie_js_minify) {
		webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,

			compress: {
				unused: true,
				dead_code: true,
				warnings: false
			},
			// mangle: {
			//	except: ['$super', '$', 'exports', 'require']
			// },
			output: {
				comments: false
			}
		}));
	}

	webpackConfig.plugins.push(new webpack.BannerPlugin(config.banner, {
		raw: true
	}));

	// ------------------------------------
	// Pre-Loaders
	// ------------------------------------
	/* webpackConfig.module.preLoaders = [{
		test: /\.(js|jsx)$/,
		loader: 'eslint',
		exclude: /node_modules/
	}];

	webpackConfig.eslint = {
		configFile: path.resolve('.eslintrc'),
		emitWarning: __DEV__
	}; */

	// ------------------------------------
	// Loaders
	// ------------------------------------
	// JavaScript / JSON
	webpackConfig.module.loaders = [{
		test: /\.json$/,
		loader: 'json'
	}];

	/* loaders: [
	// { test: /(swiper)/, loader: 'imports?define=>false&this=>window' }
	] */

	// File loaders
	/* eslint-disable */
	webpackConfig.module.loaders.push(
		{ test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
		{ test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
		{ test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
		{ test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
		{ test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
		{ test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
		{ test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
	);
	/* eslint-enable */

	return webpackConfig;
}
