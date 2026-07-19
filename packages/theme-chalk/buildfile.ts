import { glob } from 'fast-glob'
import path from 'path'
import { indexOutput } from '../../build/pkg'
import { copyFile, mkdir, writeFile } from 'fs/promises'
import { execCommand } from '../../build/utils/log'
import { compileAsync } from 'sass-embedded'
import { chunk } from 'lodash-unified'
import { transform } from 'lightningcss'
import consola from 'consola'
import { styleText } from 'util'

const distFolder = path.resolve(__dirname, 'dist')
const distBundle = path.resolve(indexOutput, 'theme-chalk')

async function compress(filename: string, css: string) {
  const result = transform({
    filename,
    code: Buffer.from(css),
    minify: true,
    sourceMap: false,
    targets: {
      chrome: 85 << 16,
      firefox: 79 << 16,
      safari: (14 << 16) | (1 << 8),
      edge: 85 << 16,
    },
  })
  return result.code
}

const processfiles = async (scssFiles: string[]) => {
  const noElPrefixFile = /(index|base|display)/
  await mkdir(distFolder, { recursive: true })
  for (const scssFile of scssFiles) {
    const fullPath = path.resolve(__dirname, scssFile)
    const baseName = path.basename(scssFile, '.scss')

    const cssResult = await compileAsync(fullPath)
    const compressed = await compress(baseName, cssResult.css)

    const outputName = noElPrefixFile.test(baseName)
      ? `${baseName}.css`
      : `bc-${baseName}.css`

    const outputPath = path.join(distFolder, outputName)
    await writeFile(outputPath, compressed)

    consola.success(
      `${styleText('cyan', outputName)}: ${styleText(
        'yellow',
        `${cssResult.css.length / 1000}`
      )} KB -> ${styleText('green', `${compressed.length / 1000}`)} KB`
    )
  }
}

async function copyThemeChalkBundle() {
  const files = await glob(['dist/**/*'], { cwd: __dirname })
  for (const file of files) {
    const source = path.resolve(__dirname, file)
    const dest = path.resolve(distBundle, path.relative('dist', file))
    await mkdir(path.dirname(dest), { recursive: true })
    await copyFile(source, dest)
  }
}

async function copyThemeChalkSource() {
  const destDir = path.resolve(distBundle, 'src')
  const files = await glob(['src/**/*'], { cwd: __dirname })

  for (const file of files) {
    const source = path.resolve(__dirname, file)
    const dest = path.resolve(destDir, path.relative('src', file))
    await mkdir(path.dirname(dest), { recursive: true })
    await copyFile(source, dest)
  }
}

async function buildThemeChalk() {
  const scssFiles = await glob('src/*.scss', {
    cwd: __dirname,
    absolute: true,
  })
  const chunks = chunk(scssFiles, Math.ceil(scssFiles.length / 5))
  return Promise.all(chunks.map(processfiles))
}


async function buildTheme() {
  await execCommand(copyThemeChalkSource)
  await Promise.all([
    execCommand(buildThemeChalk)
  ])
  await execCommand(copyThemeChalkBundle)
}

function build() {
  execCommand(buildTheme)
}

build()

