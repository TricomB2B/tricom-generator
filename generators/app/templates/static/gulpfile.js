// Settings

var siteUrl = 'app.dev';

var coreScss = 'src/scss/app.scss';

var jsFiles    = [
  'src/components/**/*.factory.js',
  'src/components/**/*.directive.js',
  'src/components/**/*.service.js',
  'src/js/*.js',
  'src/views/**/*.js'
];
var scssFiles  = ['src/**/*.scss'];
var viewFiles  = ['src/views/**/*.html', 'src/components/**/*.html'];
var fontFiles  = []; // add font files here

var jsVendors  = [
  'node_modules/angular/angular.js',
  'node_modules/angular-ui-router/release/angular-ui-router.js',
  'node_modules/angular-resource/angular-resource.js'
];
var cssVendors = [
  'node_modules/normalize-sass/normalize'
];


// Assign Gulp
var gulp        = require('gulp'),
  browserSync = require('browser-sync').create(),
  jasmine     = require('gulp-jasmine'),
  reporters   = require('jasmine-reporters'),
  karma       = require('karma').server;

// Plugins
$ = require('gulp-load-plugins')({
  pattern: [
    'gulp-*'
  ]
});

/*
 *
 *  Gulp Logic
 *
 */

// browser-sync task for starting the server by proxying a local url
gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: siteUrl
  });
});

// launch browser sync as a server without a local url
gulp.task('browser-sync-server', function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

// Lint Javascript Task
gulp.task('lint', function() {
  return gulp.src(jsFiles)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

// compile, prefix, and minify the sass
gulp.task('styles', function() {
  return gulp.src(coreScss)
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer(["> 1%", "last 2 versions"], { cascade: true }))
    .pipe(gulp.dest('./css'))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.cleanCss())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task('scripts', ['lint'], function() {
  return gulp.src(jsFiles)
    .pipe($.plumber())
    .pipe($.ngAnnotate())
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./js'))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
});

// Concatenate and Minify Vendor JS
gulp.task('js-vendors', function() {
  return gulp.src(jsVendors)
    .pipe($.plumber())
    .pipe($.concat('vendors.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./js'));
});

// copy fonts
gulp.task('fonts', function() {
  gulp.src(fontFiles)
    .pipe(gulp.dest('./fonts'));
});

// copy views
gulp.task('views', function() {
  gulp.src(viewFiles)
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./views'));
});

// copy vendor CSS
gulp.task('css-vendors', function () {
  return gulp.src(cssVendors)
    .pipe(gulp.dest('.'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(jsFiles, ['scripts']);
  gulp.watch(scssFiles, ['styles']);
  gulp.watch(viewFiles, ['views']);
});

// Unit testing
gulp.task('tests', function(done) {

  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);

});










// task chains
gulp.task('default', ['styles', 'fonts', 'views', 'css-vendors', 'js-vendors', 'scripts', 'watch']); // build app
gulp.task('serve', ['styles', 'scripts', 'fonts', 'views', 'browser-sync-server', 'watch']); // launch server
gulp.task('build', ['styles', 'scripts', 'fonts', 'views', 'browser-sync', 'watch']); // proxy
gulp.task('vendors', ['css-vendors', 'js-vendors']); // vendor js and css
gulp.task('test', ['tests', 'watch']);
gulp.task('test-once', ['tests']);
