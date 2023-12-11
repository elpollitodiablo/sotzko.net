const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const fs = require('fs')
const uglifycss = require('gulp-uglifycss')

const src = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    css: 'src/css',
    html: 'src/*.html',
    env: 'src/site.env',
}

const sassCompile = (cb) => {
    gulp.src(src.scss, { sourcemaps: true })
        .pipe(
            sass({
                includePaths: ['node_modules'],
            }).on('error', sass.logError)
        )
        .pipe(concat('style.min.css'))
        .pipe(
            uglifycss({
                maxLineLen: 200,
                uglyComments: true,
            })
        )
        .pipe(gulp.dest(src.css, { sourcemaps: '.' }))
        .pipe(browserSync.stream())

    cb()
}

gulp.task('copyFontAwesomeFonts', () => {
    return gulp
        .src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('./src/css/webfonts'))
})

gulp.task('sass', (cb) => {
    return sassCompile(cb)
})

gulp.task('setTargetEnvironment', (cb) => {
    const params = process.argv.filter((a) => a.startsWith('--target='))
    if (params.length !== 1)
        throw new Error(
            'Task "serve" must be followed by the parameter "--target=xyz"'
        )

    const param = params[0]
    let targetEnv = param.split('=')[1]
    if (!targetEnv) targetEnv = 'local'
    targetEnv = targetEnv.toLowerCase()

    console.log(`Use target environment ${targetEnv}`)

    fs.copyFile(`./env/${targetEnv}.properties`, src.env, cb)
})

gulp.task(
    'serve',
    gulp.series('setTargetEnvironment', () => {
        // fs.writeFile(src.env, 'contents', cb);
        browserSync.init({
            server: {
                baseDir: './src',
            },
            port: 3000,
            open: false,
        })
        gulp.watch(src.js).on('change', browserSync.reload)
        gulp.watch(src.scss, sassCompile)
    })
)
