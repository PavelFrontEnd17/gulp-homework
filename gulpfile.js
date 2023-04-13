const gulp = require('gulp');
const { series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');

const html = () => {
    return gulp.src('src/pug/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('build'))
}

const styles = () => {
    return gulp.src('src/styles/*.scss') 
        .pipe(sass().on('err', sass.logError))
        .pipe(autoprefixer())
        // .pipe(cssnano())
        .pipe(rename( { suffix: '.min' } ))
        .pipe(gulp.dest('build/css'))
}

const fonts = () =>{
    return gulp.src('src/fonts/*.ttf')
        .pipe(gulp.dest('build/fonts'))
}


const images = () => {
    return gulp.src('src/images/*.*') 
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
}

const server = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false
    });
    browserSync.watch('build', browserSync.reload)
}

const deleteBuild = (cb) => {
    return del('build/**/*.*').then(() => { cb() })
}

const watch = () => {
    gulp.watch('src/pug/**/*.pug', html);
    gulp.watch('src/styles/**/*.scss', styles);
    gulp.watch('src/images/*.*', images);
}

exports.default = series(
    deleteBuild,
    parallel(html, styles, fonts, images),
    parallel(watch, server)
)

