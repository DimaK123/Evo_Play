// import gulp from 'gulp';

// import { path } from './gulp/config/path.js';
// // Импорт общих плагинов
// import { plugins } from './gulp/config/plugins.js';

// // Передаем занчения в глобальную переменную
// global.app = {
//   path: path,
//   gulp: gulp,
//   plugins: plugins
// }

// // Импорт задач
// import { copy } from './gulp/tasks/copy.js';
// import { reset } from './gulp/tasks/reset.js';
// import { html } from './gulp/tasks/html.js';

// // Наблюдаем за изменениям в файлах
// function watcher() {
//   gulp.watch(path.watch.files, copy);
//   gulp.watch(path.watch.html, copy);
// }

// const mainTasks = gulp.parallel(copy, html);

// // Построение счценариев выполнения задач
// const dev = gulp.series(reset, mainTasks, watcher);


// // Выполнение сценариев по умолчанию
// gulp.task('default', dev);

const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
// const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');


// Этот участок кода нужен для работы с файлами js
// function scripts() {
//   return src('src/js/main.js')
//     .pipe(concat('main.min.js'))
//     .pipe(uglify()) // компрессия итогового файла js
//     .pipe(dest('src/js')) // указываем куда положить итоговый файл
//     .pipe(browserSync.stream()) // обновление страницы после изменений
// }

function styles() {
  return src('src/style/style.scss') // путь к файлу, с которым будем работать
    .pipe(concat('style.min.css')) // concat переименовывает итоговый файл, который мы получим после сборки
    .pipe(scss({ outputStyle: 'compressed' })) // компрессия итогового файла scss
    .pipe(dest('src/style')) // указываем куда положить итоговый файл
    .pipe(browserSync.stream()) // обновление страницы после изменений
}

function watching() {
  watch(['src/style/**/*.scss'], styles);
  // watch(['src/js/main.js'], scripts); Этот участок кода нужен для работы с файлами js
  watch(['src/*.html']).on('change', browserSync.reload) // данный синтаксис, /*.html, означает, что мы смотрим за всеми файлами html в папке src. Если нужно следить дополнительно за всеми подпапками, то нужно использовать синтаксис /**/*.html
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "src/"
    }
  })
}

function cleanDist() {
  return src('dist')
    .pipe(clean())
}

function building() {
  return src([
    'src/style/style.min.css',
    // 'src/js/main.min.js', Этот участок кода нужен для работы с файлами js
    'src/**/*.html'
  ], { base: 'src' })
    .pipe(dest('dist'))
}

exports.styles = styles; // чтобы ф-ции выше работали, их надо экспортировать 
// exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building);
// exports.default = parallel(styles, scripts, browsersync, watching); - scripts нужно будет подключить, если будем выполнять файл скриптов
exports.default = parallel(styles, browsersync, watching);