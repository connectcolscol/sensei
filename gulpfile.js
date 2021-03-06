/* eslint-disable */
/**
 * Gulp File
 *
 * 1) Make sure you have node and npm installed locally
 *
 * 2) Install all the modules from package.json:
 * $ npm install
 *
 * 3) Run gulp to mifiy javascript and css using the 'gulp' command.
 */


var gulp            = require( 'gulp' );
var rename          = require( 'gulp-rename' );
var uglify          = require( 'gulp-uglify' );
var minifyCSS       = require( 'gulp-minify-css' );
var chmod           = require( 'gulp-chmod' );
var del             = require( 'del' );
var sass            = require( 'gulp-sass' );
var wpPot           = require( 'gulp-wp-pot' );
var sort            = require( 'gulp-sort' );
var checktextdomain = require( 'gulp-checktextdomain' );
var babel           = require( 'gulp-babel' );

var paths = {
	scripts: ['assets/js/**/*.js'],
	css: ['assets/css/**/*.scss'],
};

var babelOptions = {
	'presets': [
		[ 'env', {
			'targets': {
				'browsers': [
					"last 2 versions",
					"Safari >= 9",
					"iOS >= 9",
					"not ie <= 10"
				]
			}
		} ],
		'stage-3'
	],
};

gulp.task( 'clean', gulp.series(function( cb ) {
	return del( ['assets/js/**/*.min.js','assets/js/**/*.min.js', 'assets/css/**/*.min.css'], cb );
}));

gulp.task( 'CSS', gulp.series( function() {
	return gulp.src( paths.css )
    .pipe( sass().on('error', sass.logError))
		.pipe( minifyCSS({ keepBreaks: false }) )
		.pipe( gulp.dest( 'assets/css' ) );
}));

gulp.task( 'JS', gulp.series( function() {
	return gulp.src( paths.scripts )
		.pipe( babel( babelOptions ) )
		// This will minify and rename to *.min.js
		.pipe( uglify() )
		.pipe( rename({ extname: '.min.js' }) )
		.pipe( chmod( 0o644 ) )
		.pipe( gulp.dest( 'assets/js' ));
}));

gulp.task( 'pot', gulp.series( function() {
	return gulp.src( [ '**/**.php', '!node_modules/**'] )
		.pipe( sort() )
		.pipe( wpPot({
			domain: 'woothemes-sensei',
			bugReport: 'https://www.transifex.com/woothemes/sensei-by-woothemes/'
		}) )
		.pipe( gulp.dest( 'lang/woothemes-sensei.pot' ) );
}));

gulp.task( 'textdomain' , gulp.series( function() {
	return gulp.src( [ '**/*.php', '!node_modules/**'] )
		.pipe( checktextdomain({
			text_domain: 'woothemes-sensei',
			keywords: [
				'__:1,2d',
				'_e:1,2d',
				'_x:1,2c,3d',
				'esc_html__:1,2d',
				'esc_html_e:1,2d',
				'esc_html_x:1,2c,3d',
				'esc_attr__:1,2d',
				'esc_attr_e:1,2d',
				'esc_attr_x:1,2c,3d',
				'_ex:1,2c,3d',
				'_n:1,2,4d',
				'_nx:1,2,4c,5d',
				'_n_noop:1,2,3d',
				'_nx_noop:1,2,3c,4d'
			]
		}));
}));

gulp.task( 'default', gulp.series( 'clean', 'CSS', 'JS' ) );
