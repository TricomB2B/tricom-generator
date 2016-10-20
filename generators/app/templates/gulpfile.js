// Proxy URL (optional)
var siteUrl = '*.dev';

// reference to the main scss file
var coreScss = 'src/scss/app.scss';

// project files
var jsFiles   = ['src/**/*.js'];
var scssFiles = ['src/**/*.scss'];
var htmlFiles = ['src/**/*.html'];
var fontFiles = []; // add font files here

// vendor files
var jsVendors = [
  'node_modules/angular/angular.js',
  'node_modules/angular-ui-router/release/angular-ui-router.js',
  'node_modules/angular-resource/angular-resource.js'
];
var cssVendors = [];

// distribution directories
var jsDest     = './dist/js';
var cssDest    = './dist/css';
var htmlDest   = './dist/html';
var fontDest   = './dist/fonts';
var vendorDest = './dist/vendors';

// plugins
var gulp        = require('gulp'),
  browserSync = require('browser-sync').create(),
  reporters   = require('jasmine-reporters'),
  karma       = require('karma').server;

// set up gulp-specific plugins
$ = require('gulp-load-plugins')({
  pattern: [
    'gulp-*'
  ]
});

/****************************************
 Gulp logic
 *****************************************/

// browser-sync task for starting the server by proxying a local url
gulp.task('browser-sync-proxy', function() {
  browserSync.init({
    proxy: siteUrl
  });
});

// launch browser sync as a standalone server
gulp.task('browser-sync-standalone', function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

// Lint Javascript Task
gulp.task('lint', function() {
  return gulp.src(jsFiles)
    .pipe($.jshint({esversion: 6}))
    .pipe($.jshint.reporter('jshint-stylish'));
});

// Concatenate & Minify JS
gulp.task('scripts', ['lint'], function() {
  return gulp.src(jsFiles)
    .pipe($.plumber())
    .pipe($.ngAnnotate())
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.js'))
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(jsDest))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(jsDest))
    .pipe(browserSync.stream());
});

// compile, prefix, and minify the sass
gulp.task('styles', function() {
  return gulp.src(coreScss)
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer(["> 1%", "last 2 versions"], { cascade: true }))
    .pipe(gulp.dest(cssDest))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.cleanCss())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

// Concatenate and Minify Vendor JS
gulp.task('js-vendors', function() {
  return gulp.src(jsVendors)
    .pipe($.plumber())
    .pipe($.concat('vendors.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(vendorDest));
});

// copy fonts
gulp.task('fonts', function() {
  gulp.src(fontFiles)
    .pipe(gulp.dest(fontDest));
});

// copy views
gulp.task('views', function() {
  gulp.src(htmlFiles)
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe($.rename({dirname: '/', suffix: '.min'}))
    .pipe(gulp.dest(htmlDest));
});

// copy vendor CSS
gulp.task('css-vendors', function () {
  return gulp.src(cssVendors)
    .pipe(gulp.dest(vendorDest));
});

// compress and combine svg icons
gulp.task('svg', function () {
  return gulp.src('./img/icons/*.svg')
    .pipe($.svgmin())
    .pipe($.svgstore())
    .pipe(gulp.dest('./img/icons'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(jsFiles, ['scripts']);
  gulp.watch(scssFiles, ['styles']);
  gulp.watch(htmlFiles, ['views']);
  gulp.watch('**/*.html', browserSync.reload);
});

// Unit testing
gulp.task('tests', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

/****************************************
 Gulp Tasks
 *****************************************/

// default task builds everything, opens up a proxy server, and watches for changes
gulp.task('default', [
  'styles',
  'scripts',
  'fonts',
  'views',
  'browser-sync-standalone',
  'watch'
]);

// local task builds everything, opens up a standalone server, and watches for changes
gulp.task('proxy', [
  'styles',
  'scripts',
  'fonts',
  'views',
  'browser-sync-proxy',
  'watch'
]);

// builds everything
gulp.task('build', [
  'styles',
  'scripts',
  'fonts',
  'views',
  'css-vendors',
  'js-vendors'
]);

// builds the vendor files
gulp.task('vendors', [
  'css-vendors',
  'js-vendors'
]);

// run the tests and watch for changes
gulp.task('test', [
  'tests',
  'watch'
]);

// run the tests once
gulp.task('test-once', ['tests']);
