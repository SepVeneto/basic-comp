import path from 'node:path'

export * from '../../build/pkg'

export const projRoot = path.resolve(__dirname, '../../..')
export const docsDirName = 'docs'
export const docRoot = path.resolve(__dirname, '../..', docsDirName)

export const REPO_OWNER = 'SepVeneto'
export const REPO_NAME = 'basic-comp'
export const REPO_PATH = `${REPO_OWNER}/${REPO_NAME}`
export const REPO_BRANCH = 'master'
