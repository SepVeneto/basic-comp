import fs from 'fs'
import path from 'path'
import type { Module } from './module'
import { buildConfig } from './module'
import { generateTypesDefinitions } from './tasks/types-definitions'
import {
  buildOutput,
  indexOutput,
  indexPackage,
  indexRoot,
  projectRoot,
  themeDir,
} from './pkg'
import { buildModules } from './tasks/modules'
import { execCommand } from './utils/log'
import { run } from './utils'
import { copyFile, cp, mkdir, rm } from 'fs/promises'

const copyFiles = () =>
  Promise.all([
    copyFile(indexPackage, path.join(indexOutput, 'package.json')),
    copyFile(
      path.resolve(projectRoot, 'README.md'),
      path.resolve(indexRoot, 'README.md')
    ),
    copyFile(
      path.resolve(projectRoot, 'types', 'global.d.ts'),
      path.resolve(indexOutput, 'global.d.ts')
    ),
    copyFile(
      path.resolve(projectRoot, 'LICENSE'),
      path.resolve(indexOutput, 'LICENSE')
    ),
  ])

const copyFullStyle = async () => {
  await mkdir(path.resolve(indexOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(indexOutput, 'theme-chalk/index.css'),
    path.resolve(indexOutput, 'dist/index.css')
  )
}

const buildStyle = async () => {
  await run('pnpm run -C packages/theme-chalk build')
  await copyFullStyle()
}

const makeOutput = async () => {
  await execCommand(() => run('pnpm run clean'), 'clean output')
  await execCommand(() => mkdir(indexOutput, { recursive: true }), 'create output')
}

const cleanupTypesDefinitions = () => {
  return rm(path.resolve(buildOutput, 'types'), { recursive: true })
}

async function build() {
  await makeOutput()
  await Promise.all([
    execCommand(generateTypesDefinitions),
    execCommand(buildModules),
    execCommand(buildStyle),
    execCommand(copyFiles),
  ])
  await execCommand(copyTypesDefinitions)
  await execCommand(cleanupTypesDefinitions)
}

function main() {
  return execCommand(build)
}

main()

const copyTypesDefinitions = () => {
  const src = path.resolve(buildOutput, 'types')
  const copyTypes = (module: Module) => {
    return execCommand(
      () => cp(src, buildConfig[module].output.path, { recursive: true }),
      `copyTypes:${module}`
    )
  }

  return Promise.all([copyTypes('esm'), copyTypes('cjs')])
}
