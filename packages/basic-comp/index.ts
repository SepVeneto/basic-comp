import installer from './install'

export * from '@basic-comp/components'
export * from '@basic-comp/utils'
export * from '@basic-comp/hooks'

export const install = installer.install;
export default {
  install,
}