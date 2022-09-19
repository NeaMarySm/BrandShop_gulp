import fs from 'fs';
import fonter from 'gulp-fonter-unx';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
    //Ищем файлы шрифтов .otf
     return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            })
        ))
        // конвертируем в ttf
        .pipe(fonter({
            formats: ['ttf']
        }))

        //выгружаем в исходную папку
        .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts`));
}
        
export const ttfToWoff = () => {
    //Ищем файлы шрифтов .ttf

    return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            })
        ))
        // конвертируем в .woff
        .pipe(fonter({
            formats: ['woff']
        }))

        //выгружаем в папку с результатами
        .pipe(app.gulp.dest(app.path.build.fonts))

        //ищем файлы .ttf
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))

        //конвертируемв в .woff2

        .pipe(ttf2woff2())
        //выгружаем в папку с результатами
        .pipe(app.gulp.dest(`${app.path.build.fonts}`));
}

export const fontsStyle = () => {
    // файл стилей подключения шрифтов
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
    // проверяем существуют ли файлы шрифтов
    fs.readdir(app.path.build.fonts, function(err, fontsFiles){
        if(fontsFiles) {
            //проверяет существует ли файл стилей для подключения шрифтов
            if(!fs.existsSync(fontsFile)){
                //если файла нет создаем его
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;
                for(let i = 0; i < fontsFiles.length; i++){
                    let fontFileName = fontsFiles[i].split('.')[0];
                    if(newFileOnly !== fontFileName){
                        let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
                        let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
                        switch(fontWeight.toLowerCase()){
                            case('thin') : fontWeight = 100;
                            break;
                            case('extralight') : fontWeight = 200;
                            break;
                            case('light') : fontWeight = 300;
                            break;
                            case('medium') : fontWeight = 500;
                            break;
                            case('semibold') : fontWeight = 600;
                            break;
                            case('bold') : fontWeight = 700;
                            break;
                            case('extrabold') : fontWeight = 800;
                            break;
                            case('heavy') : fontWeight = 800;
                            break;
                            case('black') : fontWeight = 900;
                            break;
                            default: fontWeight = 400;
                        }
                        fs.appendFile(fontsFile, `@font-face{\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
                        // fs.appendFile(fontsFile,
                        //     `@font-face {
                        //         font-family: ${fontName};
                        //         font-display: swap;
                        //         src: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");
                        //         font-weight: ${fontWeight};
                        //         font-style: normal;
                        //     }\r\n` , cb); // лучше подключать более оптимизированный код в одну строку с переносом и табуляцией строки \n\t
                            newFileOnly = fontFileName;         
                    }
                    else {
                        console.log('Файл scss/fonts.scss уже существует. Для обновления удалите файл');
                    }
                }
            }
        }
    });
    return app.gulp.src(`${app.path.srcFolder}`);
    function cb(){}
}
        





        

