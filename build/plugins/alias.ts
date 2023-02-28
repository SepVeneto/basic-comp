import type { Plugin } from 'rollup'
export async function Alias(): Promise<Plugin> {
  return {
    name: 'alias-plugin',
    resolveId(id, importer, options) {
      if (!id.startsWith('@basic-comp')) return
      const THEME_CHALK = '@basic-comp/theme-chalk'
      if (id.startsWith(THEME_CHALK)) {
        return {
          id: id.replaceAll(THEME_CHALK, '@sepveneto/basic-comp/theme-chalk'),
          external: 'absolute'
        }
      }
      return this.resolve(id, importer, { skipSelf: true, ...options })
    }
  }
}