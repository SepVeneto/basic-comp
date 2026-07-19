/**
 * fork from https://github1s.com/element-plus/element-plus/blob/HEAD/internal/build/src/tasks/types-definitions.ts
 */

import path from 'path'
import glob from 'fast-glob'
import {
  buildOutput,
  indexPackage,
  indexRoot,
  pkgRoot,
  projectRoot as projRoot,
} from '../pkg'


import type { BuildOptions } from 'rolldown'
import { build } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import { excludeFiles, getPackageDependencies } from '../utils'


const tsconfig = path.resolve(projRoot, 'tsconfig.web.json')
const indexDeps = getPackageDependencies(indexPackage)
const pkgExternal = Object.values(indexDeps).flat()
const external = [/^@vue/, /^vue/, /element-plus/, ...pkgExternal]

export const generateTypesDefinitions = async () => {
  const input = excludeFiles(
    await glob('**/*.{ts,tsx,vue}', {
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
      preserveModulesRoot: indexRoot,
      dir: path.resolve(buildOutput, 'types'),
    },
  }

  return build(options)
}
