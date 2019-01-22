var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var babel        = require('gulp-babel');
var concat       = require('gulp-concat');
var eslint       = require('gulp-eslint');
var inject       = require('gulp-inject-string');
var rename       = require('gulp-rename');
var replace      = require('gulp-replace');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var stylelint    = require('gulp-stylelint');
var uglify       = require('gulp-uglify');
var webpack      = require('webpack-stream');

var foundationSCSS = [
    'node_modules/normalize.scss/sass',
    'node_modules/foundation-sites/scss',
    'node_modules/motion-ui/src'
];

var appSCSS = [
    './static/scss/components/**/*.scss',
    './static/scss/shared/**/*.scss',
];

var foundationJS = [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/what-input/dist/what-input.js',
    'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.core.min.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.util.mediaQuery.min.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.util.keyboard.min.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.util.triggers.min.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.util.nest.min.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.offcanvas.min.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.accordionMenu.min.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.responsiveMenu.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.accordionMenu.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.dropdown.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.drilldown.js',
    'node_modules/foundation-sites/dist/js/plugins/foundation.dropdown.js',
    'static/js/foundation.js',
];

var commonJS = [
    'static/js/common.js',
];

// Lint SCSS
gulp.task('scss-lint', function() {
    return gulp.src(appSCSS)
        .pipe(stylelint({
            reporters: [{
                formatter: 'string',
                console: true
            }]
        }));
});

// Generate & Minify CSS
gulp.task('scss-compile', function() {
    return gulp.src('static/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
                includePaths: foundationSCSS,
                outputStyle: 'compressed'
            })
            .on('error', sass.logError))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9'],
            grid: true
        }))
        .pipe(sourcemaps.write('../sourcemaps'))
        .pipe(gulp.dest('static/dist'));
});

// Critical CSS
gulp.task('critical-compile', function() {
    return gulp.src('static/scss/critical.scss')
        .pipe(sass({
                includePaths: foundationSCSS,
                outputStyle: 'compressed'
            })
            .on('error', sass.logError))
        .pipe(replace("../fonts", "{$AbsoluteBaseURL}{$ThemeDir}/fonts"))
        .pipe(replace("../images", "{$AbsoluteBaseURL}{$ThemeDir}/images"))
        .pipe(replace('\\f', '\\\\f'))
        .pipe(replace('\\e', '\\\\e'))
        .pipe(replace('\\0', '\\\\0'))
        .pipe(replace('\\2', '\\\\2'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9'],
            grid: true
        }))
        .pipe(rename('CriticalCSS.ss'))
        .pipe(inject.wrap('<style>\n', '</style>'))
        .pipe(gulp.dest('./templates/Includes/'));
});

// Lint JS
gulp.task('js-lint', function() {
    return gulp.src('static/js/**/*.js')
        .pipe(eslint({
            'configFile':'.eslintrc'
        }))
        .pipe(eslint.format());
});

// Generate & Minify JS
gulp.task('js-compile', function() {
    gulp.src(foundationJS)
        .pipe(concat('foundation.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('static/dist'));
    gulp.src(commonJS)
        .pipe(webpack())
        .pipe(concat('common.min.js'))
        .pipe(babel({
            presets: [
              [
                "env",
                {
                  "targets": {
                    "browsers": [
                      "last 2 versions"
                    ]
                  }
                }
              ]
            ]
        }))
        .pipe(uglify())
        .pipe(gulp.dest('static/dist'));

});

// SCSS and JS build tasks
gulp.task('scss', ['scss-compile', 'critical-compile']);
gulp.task('js', ['js-compile']);

// Default
gulp.task('default', ['scss', 'js'], function() {
    gulp.watch(['static/scss/**/*.scss'], ['scss']);
    gulp.watch(['static/js/**/*.js'], ['js']);
});
