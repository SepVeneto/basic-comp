import path from 'path'
import { dest, parallel, series, src } from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import { cyan, green, yellow } from 'kolorist'

function compileScss() {
  const sass = gulpSass(dartSass)
  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCss({}, (details) => {
      console.log(`${cyan(details.name)}: ${yellow(
        details.stats.originalSize / 1000,
      )} KB -> ${green(details.stats.minifiedSize / 1000)} KB`)
    }))
    .pipe(dest(path.resolve(__dirname, 'dist')))
}

export const build = parallel(
  series(compileScss),
)

export default build
