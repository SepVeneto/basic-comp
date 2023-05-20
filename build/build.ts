import fs from 'fs'
import path from 'path'
import { copy } from 'fs-extra'
import chalk from 'chalk'
import { execSync } from 'child_process'
import type { Module } from './module'
import { buildConfig, buildModules } from './module'
import { generateTypesDefinitions } from './types-definitions'
import {
  indexOutput,
  indexRoot,
  outputDir,
  projectRoot,
  themeDir,
} from './pkg'

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

async function copyFiles() {
  await fs.promises.cp(path.resolve(projectRoot, 'global.d.ts'), path.resolve(indexOutput, 'global.d.ts'))
  await fs.promises.cp(path.resolve(indexRoot, 'package.json'), path.resolve(indexOutput, 'package.json'))
}

(async () => {
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

  await copyReadme()

  await copyTypesDefinitions()

  // console.log('pack')
  // execSync('cd ./dist && npm pack --pack-destination ../')
})().then(() => {
  green('success')
  process.exit(0)
})

function green(str: string) {
  console.log(chalk.green(str))
}

async function copyStyle() {
  // await fs.promises.cp(path.resolve(indexRoot, 'index.d.ts'), path.resolve(outputDir, 'lib', 'index.d.ts'));
  const styleDir = path.join(indexOutput, 'theme-chalk')
  fs.mkdirSync(styleDir, { recursive: true })
  await fs.promises.cp(path.join(themeDir, 'index.css'), path.join(indexOutput, 'theme-chalk', 'index.css'))
}

async function copyReadme() {
  await fs.promises.cp(path.resolve(projectRoot, 'README.md'), path.resolve(indexOutput, 'README.md'))
}

function copyTypesDefinitions() {
  const src = path.resolve(outputDir, 'types', 'packages')
  const copyTypes = (module: Module) => {
    return copy(src, buildConfig[module].output.path)
  }
  return Promise.all([copyTypes('esm'), copyTypes('cjs')])
}
