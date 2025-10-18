import * as path from 'path'

export const PKG_PREFIX = '@basic-comp'
export const projectRoot = path.resolve(__dirname, '..')
export const pkgRoot = path.resolve(__dirname, '../packages')
export const indexRoot = path.resolve(pkgRoot, 'basic-comp')
export const compRoot = path.resolve(pkgRoot, 'components')
export const outputDir = path.resolve(__dirname, '../dist')
export const themeDir = path.resolve(pkgRoot, 'theme-chalk/dist')
export const indexOutput = path.resolve(outputDir, 'basic-comp')
