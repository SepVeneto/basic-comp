import * as path from 'path'

export const PKG_NAME = 'basic-comp'
export const PKG_PREFIX = '@basic-comp'
export const projectRoot = path.resolve(__dirname, '..')
export const pkgRoot = path.resolve(projectRoot, 'packages')
export const indexRoot = path.resolve(pkgRoot, 'basic-comp')
export const indexPackage = path.resolve(indexRoot, 'package.json')
export const compRoot = path.resolve(pkgRoot, 'components')
export const themeDir = path.resolve(pkgRoot, 'theme-chalk/dist')

export const buildOutput = path.resolve(projectRoot, 'dist')
export const indexOutput = path.resolve(buildOutput, 'basic-comp')
