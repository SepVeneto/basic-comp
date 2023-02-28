/* eslint-disable */
import fs from 'fs'
import path from 'path'
import { copy } from 'fs-extra'
import rollup, { OutputOptions } from 'rollup'
import vue from  '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import css from 'rollup-plugin-css-only'
import filesize, { FileSizeInfo, FileSizeOptions } from 'rollup-plugin-filesize'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import babel from '@rollup/plugin-babel'
import chalk from 'chalk'
import typescript from '@rollup/plugin-typescript'
import scss from 'rollup-plugin-scss'
import { execSync } from 'child_process'
import { buildModules, Module, buildConfig } from './module'
import { generateTypesDefinitions } from './types-definitions'
import {
  outputDir,
  indexRoot,
  themeDir,
  projectRoot,
  indexOutput,
} from './pkg'

const VUE_REGEX = 'vue'
const VUE_MONO = '@vue'

const plugins = [
  scss({
    // output: 'bundle.css'
  }),
  // babel({ babelHelpers: 'bundled', extensions: ['.tsx'] }),
  // vue({
  //   target: 'browser',
  // }),
  vue(),
  vueJsx(),
  // typescript({
  //   noEmitOnError: true, // 运行时是否验证ts错误
  // }),
  nodeResolve(),
  esbuild(),
]

// const pathsRewriter = (id: string) => {
//   if (id.startsWith(`${EP_PREFIX}/components`))
//     return id.replace(`${EP_PREFIX}/components`, '..')
//   if (id.startsWith(EP_PREFIX) && ['icons'].every((e) => !id.endsWith(e)))
//     return id.replace(EP_PREFIX, EP_PREFIX)
//   if (id.startsWith('@basic-components')) {
//     return id.replace('@basic-components', '.')
//   }
//   return id
// }

async function reporter(opt: FileSizeOptions, outputOptions: OutputOptions, info: FileSizeInfo) {
  const values = [
    info.fileName ? [`${outputOptions.file?.split('packages/').pop()}`] : [],
    [`${info.bundleSize}`],
    ...(info.minSize
      ? [`${info.minSize}`]
      : []),
  ]
  return `${chalk.cyan(chalk.bold(values[0]))}: bundle size ${chalk.yellow(values[1])} => minified ${chalk.green(values[2])}`
}

async function copyFiles() {
  await fs.promises.cp(path.resolve(projectRoot, 'global.d.ts'), path.resolve(indexOutput, 'global.d.ts'))
  await fs.promises.cp(path.resolve(indexRoot, 'package.json'), path.resolve(indexOutput, 'package.json'))
}

;(async () => {
  console.log('build components')
  await buildModules()

  console.log('generate types')
  await generateTypesDefinitions()
  // await buildComponents()

  // console.log('build entry')
  // await buildEntry()

  // console.log('build index')
  // await buildIndexEntry()

  // console.log('copy type/package')
  await copyFiles()

  console.log('copy style')
  execSync('npm run build:style')
  await copyStyle()

  await copyReadme();

  await copyTypesDefinitions()

  // console.log('pack')
  // execSync('cd ./dist && npm pack --pack-destination ../')
})().then(() => {
  green('success')
  process.exit(0)
})

function red(str: string) {
  console.error(chalk.red(str))
}
function green(str: string) {
  console.log(chalk.green(str))
}


function logAndShutdown(e) {
  red(e.message)
  process.exit(1)
}

async function copyStyle() {
  // await fs.promises.cp(path.resolve(indexRoot, 'index.d.ts'), path.resolve(outputDir, 'lib', 'index.d.ts'));
  const styleDir = path.join(indexOutput, 'theme-chalk');
  fs.mkdirSync(styleDir, { recursive: true })
  await fs.promises.cp(path.join(themeDir, 'index.css'), path.join(indexOutput, 'theme-chalk', 'index.css'))
}

async function copyReadme() {
  await fs.promises.cp(path.resolve(projectRoot, 'README.md'), path.resolve(indexOutput, 'README.md'));
}


function copyTypesDefinitions() {
  const src = path.resolve(outputDir, 'types', 'packages')
  const copyTypes = (module: Module) => {
    return copy(src, buildConfig[module].output.path)
  }
  return Promise.all([copyTypes('esm'), copyTypes('cjs')])
}