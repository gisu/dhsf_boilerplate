// Modules
var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    sass        = require('gulp-ruby-sass'),
    filter      = require('gulp-filter'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    minify      = require('gulp-minify-css');
    prefix      = require('gulp-autoprefixer');

// Paths
var baseDir     = 'dist/',
    assetsDir   = baseDir + 'assets/',
    jsDir       = assetsDir + 'js/',
    cssDir      = assetsDir + 'css/',
    imageDir    = assetsDir + 'images/',
    srcDir      = 'src/',
    srcJsDir    = srcDir + 'js/',
    srcCssDir   = srcDir + 'scss/',
    bowerDir    = srcDir + 'bower_components/';


/* Task Browser Sync
------------------------------------- */
gulp.task('browser-sync', function() {
  browserSync.init([
    cssDir +'**/*.css',
    baseDir + '**/*.{html,php}',
    imageDir + '**/*.{jpg,gif,png,svg}',
    jsDir + '**/*.js'],
  { options: {
      debugInfo: true,
      watchTask: true,
      // proxy: 'domain',
      ghostMode: {
        clicks : true,
        scroll : true,
        links  : true,
        forms  : true }
    },
    server: {
      baseDir  : 'dist/'
    },
    open: true
  });
});


/* Task Sass
------------------------------------- */
gulp.task('sass', function () {
    gulp.src(srcCssDir + 'main.scss')
        .pipe(plumber())
        .pipe(sass({
            sourcemap    : false,
            style        : 'nested',
            precision    : 6
        }))
        // .pipe(minify({keepBreaks: true})) // not for dev, minify for production
        .on("error", notify.onError("Sass Compile Error!"))
        .pipe(prefix("last 1 version", "> 1%", "ie 8")) 
        .pipe(gulp.dest(cssDir));
        // .pipe(filter('**/*.css'))
        // .pipe(browserSync.reload({stream:true}));
});


/* Task Scripts
------------------------------------- */
gulp.task('scripts', function () {
    // add your JS files to be combined in the correct order here
    var concatination = [
        bowerDir + 'jquery/dist/jquery.js',
        srcJsDir + 'main.js'
    ];

    gulp.src(concatination)
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDir));
});


/* Task Modernizr
------------------------------------- */
gulp.task('modernizr', function () {
    gulp.src(bowerDir + 'modernizr/modernizr.js')
        .pipe(uglify())
        .pipe(gulp.dest(jsDir));
});


/* Task watch
------------------------------------- */
gulp.task('watch', function () {
    gulp.watch(srcCssDir + '**/*.scss', ['sass']);
    gulp.watch(srcJsDir + '**/*.js', ['scripts']);
});


/* Gulp Tasks ----------------------- */

/* Gulp Init
------------------------------------- */
gulp.task('init', [
    'sass', 
    'scripts', 
    'modernizr'
]);

/* Gulp Default
------------------------------------- */
gulp.task('default', [
    'browser-sync',
    'watch'
]);


/* Gulp Publish
------------------------------------- */
