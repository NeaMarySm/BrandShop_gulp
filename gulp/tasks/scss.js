import dartSass from 'sass';
import gulpsass from 'gulp-sass';
import rename from 'gulp-rename';

import GulpCleanCss from 'gulp-clean-css';
import webpcss from 'gulp-webpcss';
import autoPrefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';


const sass = gulpsass(dartSass);
 
export const scss = () => {
    return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "SCSS",
                message: "Error: <%= error.message %>"
            })
        ))  
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(app.plugins.replace(/@img\//g, '../img/'))
        .pipe(app.plugins.if(
            app.isBuild,
            groupCssMediaQueries()))
        .pipe(app.plugins.if(
            app.isBuild,
            webpcss(
            {
                webpClass: ".webp",
                noWebpClass: ".no-webp"
            }
        )))
        .pipe(app.plugins.if(
            app.isBuild,
            autoPrefixer({
            grid: true,
            overrideBrowserslist: ["last 3 versions"],
            cascade: true,
        })))
        // раскомментировать, если нужен несжатый файл дубль стилей
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.if(
            app.isBuild,
            GulpCleanCss()))
        .pipe(rename({
                extname: '.min.css'
        }))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browserSync.stream());
}