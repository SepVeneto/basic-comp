import { OutputOptions, RolldownBuild } from "rolldown"
import { indexPackage, indexRoot, projectRoot } from "../pkg"
import type { ProjectManifest } from '@pnpm/types'
import consola from 'consola'
import { spawn } from 'child_process'
import chalk from 'chalk'

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

export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'test', 'mock', 'buildfile', 'dist']
  const projRootPath = normalizePath(projectRoot)
  return files.filter((file) => {
    const position = file.startsWith(projRootPath) ? projRootPath.length : 0
    return !excludes.some((exclude) => file.includes(exclude, position))
  })
}

export const generateExternal = (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(indexPackage)

  return (id: string) => {
    const packages: string[] = [...peerDependencies]
    if (!options.full) {
      packages.push('@vue', ...dependencies)
    }

    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`)
    )
  }
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

export const getPackageManifest = (pkgPath: string) => {
  return require(pkgPath) as ProjectManifest
}

export function writeBundles(bundle: RolldownBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

export const run = async (command: string, cwd: string = projectRoot) =>
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
