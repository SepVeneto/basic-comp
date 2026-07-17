/**
 * fork from https://github1s.com/element-plus/element-plus/blob/HEAD/internal/build/src/tasks/types-definitions.ts
 */

import process from 'process'
import path from 'path'
// import { readFile, writeFile } from 'fs/promises'
import consola from 'consola'
import glob from 'fast-glob'
import chalk from 'chalk'
import {
  PKG_PREFIX,
  outputDir as buildOutput,
  pkgRoot,
  projectRoot as projRoot,
} from './pkg'
import type { Module } from './module'
import { buildConfig } from './module'

import { spawn } from 'child_process'
// import { copy, remove } from 'fs-extra'

import type { BuildOptions } from 'rolldown'
import { build } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

export const getPackageManifest = (pkgPath: string) => {
  return require(pkgPath)
}

export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath)
  const { dependencies = {}, peerDependencies = {} } = manifest

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  }
}

const tsconfig = path.resolve(projRoot, 'tsconfig.web.json')
// const epDeps = getPackageDependencies(epPackage)
const external = [/^@vue/, /^vue/, 'dayjs', 'element-plus']

export const generateTypesDefinitions = async () => {
  const input = excludeFiles(
    await glob('**/*.{ts,txs,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    }),
  )

  const options: BuildOptions = {
    input,
    external,
    tsconfig,
    transform: {
      target: 'es2018',
      jsx: 'preserve'
    },
    plugins: dts({
      parallel: true,
      tsconfig,
      eager: true,
      vue: true,
      emitDtsOnly: true,
      compilerOptions: {
        emitDeclarationOnly: true,
        declaration: true,
      },
    }),
    output: {
      preserveModules: true,
      preserveModulesRoot: path.resolve(pkgRoot, 'basic-comp'),
      dir: path.resolve(buildOutput, 'types'),
    },
  }

  return build(options)

  // const typesDir = path.resolve(buildOutput, 'types', 'packages')
  // const filePaths = await glob('**/*.d.ts', {
  //   cwd: typesDir,
  //   absolute: true,
  // })

  // const rewriteTasks = filePaths.map(async (filePath) => {
  //   const content = await readFile(filePath, 'utf8')
  //   await writeFile(filePath, pathRewriter('esm')(content), 'utf8')
  // })

  // await Promise.all(rewriteTasks)

  // const sourceDir = path.join(typesDir, 'basic-comp')
  // await copy(sourceDir, typesDir)
  // await remove(sourceDir)
}

export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'test', 'mock', 'buildfile', 'dist', 'theme-chalk']
  const projRootPath = normalizePath(projRoot)
  return files.filter((file) => {
    const position = file.startsWith(projRootPath) ? projRootPath.length : 0
    return !excludes.some((exclude) => file.includes(exclude, position))
  })
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

const windowsSlashRE = /\\/g
/**
 * Normalize a path to use forward slashes.
 * This is useful for ensuring consistent path formatting across different platforms.
 */
export function normalizePath(p: string): string {
  if (typeof process !== 'undefined' && process.platform === 'win32') {
    return p.replace(windowsSlashRE, '/')
  }
  return p
}
