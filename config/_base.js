import fs from 'fs';
import json from 'comment-json';

const parse = (content) => json.parse(content, null, true);

const pkg = parse(fs.readFileSync('package.json', 'utf-8'));

const currentDate = new Date();

const formatNum = num => (num < 10 ? `0${num}` : `${num}`);

const config = {
	parse,
	env: process.env.NODE_ENV || 'development',
	banner:
`/*
 * author  : ${pkg.author}
 * date    : ${currentDate.getFullYear()}-${formatNum(currentDate.getMonth() + 1)}-${formatNum(currentDate.getDate())}
 * email   : ${pkg.email}
*/
`,

	scopes: ['common', 'cms', 'activity', 'tuan', 'try', 'store', 'job'],

	// ----------------------------------
	// Project Structure
	// ----------------------------------
	src_assets: 'src/assets', // 其他资源路径
	src_styles: 'src/less', // Less 文件路径
	src_html: 'src/html', // Html 静态模板路径
	src_js: 'src/js', // Js 文件路径
	src_pkg: 'src/pkg', // 打包目录
	src_libs: 'libs', // 资源目录

	dist_root: 'dist', // 发布目录
	dist_assets: 'dist/assets', // 静态资源发布目录
	dist_css: 'dist/assets/css', // CSS 发布目录
	dist_html: 'dist', // HTML 发布目录
	dist_js: 'dist/assets/js', // JS 发布目录

	tmp_root: '.tmp', // 临时目录
	tmp_rev: '.tmp/rev', // rev 临时文件目录
	tmp_js: '.tmp/js', // js 临时文件目录
	tmp_css: '.tmp/css', // css 临时文件目录

	// ----------------------------------
	// Package Configuration
	// ----------------------------------
	pkg_root: '.pkg',
	pkg_libs: [ // 打包库
		['lib/swiper/swiper.js', 'lib/swiper/swiper.min.js'], // swiper
		['lib/hilo/hilo.js', 'lib/hilo/hilo.min.js'] // hilo
	],

	// ----------------------------------
	// Server Configuration
	// ----------------------------------
	server_host: 'localhost',
	server_port: process.env.PORT || 3000,
	server_index: '/index.html',

	// ----------------------------------
	// Compiler Configuration
	// ----------------------------------
	compile_rev: false, // 是否启动 revison 版本控制
	compile_eslint: false, // 是否开启 eslint 检查
	compile_html_minify: false, // 是否开启压缩 html
	compile_css_minify: false, // 是否开启压缩 CSS
	complie_css_map: true, // 是否生成 CSS source map
	complie_js_minify: false, // 是否开启压缩 JS
	complie_js_map: true // 是否生成 JS source map
};

// ------------------------------------
// Environment
// ------------------------------------

config.globals = {
	'process.env.NODE_ENV': JSON.stringify(config.env),
	__ENV__: 'dev',
	__DEV__: config.env === 'development',
	__PROD__: config.env === 'production',
	__TEST__: config.env === 'test',
	__DEBUG__: config.env === 'development',
	__DEBUG_NEW_WINDOW__: false,
	__BASENAME__: JSON.stringify(process.env.BASENAME || '')
};

if (config.env === 'production') {
	config.globals.__ENV__ = 'prod';
} else if (config.env === 'test') {
	config.globals.__ENV__ = 'test';
}

// ----------------------------------
// EJS
// ----------------------------------
config.ejs = {}; // EJS 变量
config.ejs.options = Object.assign({}, config.globals, {
	imgx: 'http://ued.dev.fn.com:8080/imgx'
});

export default config;
