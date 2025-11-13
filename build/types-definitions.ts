/**
 * fork from https://github1s.com/element-plus/element-plus/blob/HEAD/internal/build/src/tasks/types-definitions.ts
 */

import process from 'process'
import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import consola from 'consola'
import glob from 'fast-glob'
import chalk from 'chalk'
import {
  PKG_PREFIX,
  outputDir as buildOutput,
  projectRoot as projRoot,
} from './pkg'
import type { Module } from './module'
import { buildConfig } from './module'

import { spawn } from 'child_process'
import { copy, remove } from 'fs-extra'

/**
 * fork = require( https://github.com/egoist/vue-dts-gen/blob/main/src/index.ts
 */
export const generateTypesDefinitions = async () => {
  await run(
    'npx vue-tsc -p tsconfig.web.json --declaration --emitDeclarationOnly --declarationDir dist/types',
  )

  const typesDir = path.resolve(buildOutput, 'types', 'packages')
  const filePaths = await glob('**/*.d.ts', {
    cwd: typesDir,
    absolute: true,
  })

  const rewriteTasks = filePaths.map(async (filePath) => {
    const content = await readFile(filePath, 'utf8')
    await writeFile(filePath, pathRewriter('esm')(content), 'utf8')
  })

  await Promise.all(rewriteTasks)

  const sourceDir = path.join(typesDir, 'basic-comp')
  await copy(sourceDir, typesDir)
  await remove(sourceDir)
}

export const excludeFiles = (files: string[]): string[] => {
  const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist']
  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude)),
  )
}

export const pathRewriter = (module: Module): ((id: string) => string) => {
  const config = buildConfig[module]

  return (id: string) => {
    // id = id.replaceAll(`${PKG_PREFIX}/theme-chalk`, `${PKG_NAME}/theme-chalk`)
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`)
    return id
  }
}

export const run = async (command: string, cwd: string = projRoot) =>
  new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    consola.info(`run: ${chalk.green(`${cmd} ${args.join(' ')}`)}`)
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else {
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`),
        )
      }
    })
    process.on('exit', onProcessExit)
  })
