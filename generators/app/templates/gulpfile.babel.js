'use strict';

// Proxy URL (optional)
const proxyUrl = '';

// paths to relevant directories
const dirs = {
  src: './src',
  dest: './dist'
};

// paths to file sources
const sources = {
  js: `${dirs.src}/**/*.js`,
  scss: `${dirs.src}/**/*.scss`,
  coreScss: `${dirs.src}/scss/app.scss`,
  html: `${dirs.src}/**/*.html`,
  img: `${dirs.src}/img/**/*.{png,jpg}`,
  font: [],
  jsVendor: [
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/angular-resource/angular-resource.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.js'
  ],
  cssVendor: [
    'node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.min.css'
  ]
};

// paths to file destinations
const dests = {
  js: `${dirs.dest}/js`,
  css: `${dirs.dest}/css`,
  html: `${dirs.src}/js`,
  img: `${dirs.dest}/img`,
  sigFile: `${dirs.src}/img/.tinypng-sigs`,
  font: `${dirs.dest}/fonts`,
  vendor: `${dirs.dest}/vendors`
};

// plugins
import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import history from 'connect-history-api-fallback';
import reporters from 'jasmine-reporters';
import karma from 'karma';

// constants
const $ = gulpLoadPlugins();
const TMPL_CACHE_HEADER = '\n// generated file. do not modify.\nangular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {';
const TINYPNG_KEY       = 'g7BmBd0TIedcR5PDn1qd8wxzvuwrob2V';

/****************************************
  Gulp Tasks
*****************************************/

// launch browser sync as a standalone local server
gulp.task('browser-sync-local', browserSyncLocal());
// browser-sync task for starting the server by proxying a local url
gulp.task('browser-sync-proxy', browserSyncProxy());
// copy vendor CSS
gulp.task('css-vendors', cssVendors());
// copy fonts
gulp.task('fonts', fonts());
// Lint Javascript Task
gulp.task('js-lint', javascriptLint());
// Concatenate and Minify Vendor JS
gulp.task('js-vendors', javascriptVendors());
// lint sass task
gulp.task('sass-lint', sassLint());
// Concatenate & Minify JS
gulp.task('scripts', ['js-lint'], scripts());
// compile, prefix, and minify the sass
gulp.task('styles', styles());
// compress and combine svg icons
gulp.task('svg', svg());
// Unit testing
gulp.task('test', test());
// compress png and jpg images via tinypng API
gulp.task('tinypng', tinypng());
// minify and concatenate views into angular template cache
gulp.task('views', views());
// Watch Files For Changes
gulp.task('watch', watch());

// // local task builds everything, opens up a standalone server, and watches for changes
gulp.task('default', [
  'views',
  'fonts',
  'styles',
  'scripts',
  'browser-sync-local',
  'watch'
]);

// default task builds everything, opens up a proxy server, and watches for changes
gulp.task('proxy', [
  'views',
  'fonts',
  'styles',
  'scripts',
  'browser-sync-proxy',
  'watch'
]);

// builds everything
gulp.task('build', [
  'views',
  'fonts',
  'styles',
  'scripts',
  'css-vendors',
  'js-vendors'
]);

// builds the vendor files
gulp.task('vendors', [
  'css-vendors',
  'js-vendors'
]);

// compresses imagery
gulp.task('images', [
  'svg',
  'tinypng'
]);

/****************************************
  Task Logic
*****************************************/

function browserSyncLocal () {
  return () => {
    browserSync.init({
      server: {
        baseDir: './',
        middleware: [ history() ]
      }
    });
  };
}

function browserSyncProxy () {
  return () => {
    browserSync.init({
      proxy: proxyUrl
    });
  };
}

function cssVendors () {
  return () => {
    return gulp.src(sources.cssVendor)
      .pipe(gulp.dest(dests.vendor));
  };
}

function fonts () {
  return () => {
    gulp.src(sources.font)
      .pipe(gulp.dest(dests.font));
  };
}

function javascriptLint () {
  return () => {
    return gulp.src(sources.js)
      .pipe($.jshint({esversion: 6}))
      .pipe($.jshint.reporter('jshint-stylish'));
  };
}

function javascriptVendors () {
  return () => {
    return gulp.src(sources.jsVendor)
      .pipe($.plumber())
      .pipe($.concat('vendors.min.js'))
      .pipe($.uglify())
      .pipe(gulp.dest(dests.vendor));
  };
}

function sassLint () {
  return () => {
    return gulp.src(sources.scss)
      .pipe($.sassLint())
      .pipe($.sassLint.format())
      .pipe($.sassLint.failOnError());
  };
}

function scripts () {
  return () => {
    return gulp.src(sources.js)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
        .pipe($.concat('app.js'))
        .pipe($.babel())
        .pipe($.ngAnnotate())
        .pipe(gulp.dest(dests.js))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(dests.js))
      .pipe(browserSync.stream());
  };
}

function styles () {
  return () => {
    return gulp.src(sources.coreScss)
      .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer(["> 1%", "last 2 versions"], { cascade: true }))
        .pipe(gulp.dest(dests.css))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.cleanCss())
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(dests.css))
      .pipe(browserSync.stream({match: '**/*.css'}));
  };
}

function svg () {
  return () => {
    return gulp.src('./src/img/icons/*.svg')
      .pipe($.svgmin())
      .pipe($.svgstore())
      .pipe(gulp.dest('./dist/img/icons'));
  };
}

function test (done) {
  return () => {
    let server = new karma.Server('./karma.conf.js', done);
    server.start();
  };
}

function tinypng () {
  return () => {
    return gulp.src(sources.img)
      .pipe($.tinypngCompress({
        key: TINYPNG_KEY,
        sigFile: dests.sigFile
      }))
      .pipe(gulp.dest(dests.img));
  };
}

function views () {
  return () => {
    gulp.src(sources.html)
      .pipe($.htmlmin({collapseWhitespace: true}))
      .pipe($.rename({dirname: '/'}))
      .pipe($.angularTemplatecache({
        filename: 'views.js',
        module: 'tcomViews',
        standalone: true,
        moduleSystem: 'IIFE',
        templateHeader: TMPL_CACHE_HEADER
      }))
      .pipe(gulp.dest(dests.html));
  };
}

function watch () {
  return () => {
    gulp.watch(sources.js, ['scripts']);
    gulp.watch(sources.scss, ['styles']);
    gulp.watch(sources.html, ['views']);
    gulp.watch('**/*.html', browserSync.reload);
  };
}
