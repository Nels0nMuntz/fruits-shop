const gulp = require('gulp');
const {src, dest} = require('gulp');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const del = require('del');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer')
const groupMedia = require('gulp-group-css-media-queries');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const imageMin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webpHtml = require('gulp-webp-html');
const webpCss = require('gulp-webpcss');
concat = require('gulp-concat');

const project_folder = 'dist';
const source_folder = 'src';

const path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/css',
        js: project_folder + '/js',
        img: project_folder + '/img',
        fonts: project_folder + '/fonts',
    },
    src: {
        html: source_folder + '/*.html',
        scss: source_folder + '/scss/style.scss',
        js: source_folder + '/js/main.js',
        img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
        fonts: source_folder + '/fonts/**/*.{eot,woff2,woff,ttf,svg}',
    },
    watch: {
        html: source_folder + '/**/*.html',
        scss: source_folder + '/scss/**/*.scss',
        js: source_folder + '/js/**/*.js',
        img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
        fonts: source_folder + '/fonts/**/*.{eot,woff2,woff,ttf,svg}',
    },
    clean: './' + project_folder + '/',
};

async function browserSyncFunc(params){
    browserSync.init({
        server: {
            baseDir: './' + project_folder + '/'
        },
        port: 3000,
        notify: false,
    })
}

function html(){
    return src(path.src.html)
    .pipe(fileInclude())
    .pipe(webpHtml())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream())
}

function css(){
    return src(path.src.scss)
    .pipe(fileInclude())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(groupMedia())
    .pipe(autoprefixer({
        overrideBrowserList: ['last 8 versions'],
        cascade: true,
    }))
    .pipe(webpCss())
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(rename({extname: '.min.css'}))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream())
}

function js(){
    return src(path.src.js)
    .pipe(fileInclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream())
}

function images(){
    return src(path.src.img)
    .pipe(webp({quality: 70}))
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(imageMin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3,
    }))
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream())
}

function fonts(){
    return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
}

function getLibsJs(){
    return src(source_folder + '/js/libs/*.js')
    .pipe(dest( path.build.js ))
    .pipe(browserSync.stream())
}

function getLibsCss(){
    return src(source_folder + '/css/*.css')
    .pipe(dest( path.build.css ))
    .pipe(browserSync.stream())
}

function clean(params){
    return del(path.clean)
}

async function watchFiles(params){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.scss], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.fonts], fonts);
    gulp.watch(source_folder + '/js/libs/*.js', getLibsJs);
    gulp.watch( source_folder + '/css/*.css', getLibsCss);    
}


let build = gulp.series(clean, gulp.parallel(html, css, getLibsCss, js, getLibsJs, fonts, images));
let watch = gulp.series(build, gulp.parallel(watchFiles, browserSyncFunc));


exports.getLibsJs = getLibsJs;
exports.getLibsCss = getLibsCss;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;