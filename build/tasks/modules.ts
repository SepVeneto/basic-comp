import { ModuleFormat, OutputOptions, rolldown } from "rolldown";
import { excludeFiles, generateExternal, writeBundles } from "../utils";
import glob from 'fast-glob'
import { indexOutput, indexRoot, PKG_NAME, pkgRoot } from "../pkg";
import { Alias } from "../plugins/alias";
import vue from '@vitejs/plugin-vue'
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";
import path from "node:path";
import { execCommand } from "../utils/log";

const modules = ['esm', 'cjs'] as const
type Module = (typeof modules)[number]
interface BuildInfo {
  module: 'ESNext' | 'CommonJS'
  format: ModuleFormat
  ext: 'mjs' | 'cjs' | 'js'
  output: {
    /** e.g: `es` */
    name: string
    /** e.g: `dist/element-plus/es` */
    path: string
  }

  bundle: {
    /** e.g: `element-plus/es` */
    path: string
  }
}
type BuildConfigEntries = [Module, BuildInfo][]

const buildConfig: Record<Module, BuildInfo> = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: path.resolve(indexOutput, 'es'),
    },
    bundle: {
      path: `${PKG_NAME}/es`,
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: path.resolve(indexOutput, 'lib'),
    },
    bundle: {
      path: `${PKG_NAME}/lib`,
    },
  },
}
const buildConfigEntries = Object.entries(
  buildConfig
) as BuildConfigEntries

const plugins = [Alias(), vue(), vueJsxPlugin()]

async function buildModulesComponents() {
  const input = excludeFiles(
    await glob(['**/*.{ts,vue}', '!**/style/(index|css).{ts,vue}'], {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const bundle = await rolldown({
    input,
    plugins,
    external: generateExternal({ full: false }),
    treeshake: { moduleSideEffects: false }
  })

  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: indexRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`
      }
    })
  )
}

export const buildModules = () => Promise.all([
  execCommand(buildModulesComponents)
])
