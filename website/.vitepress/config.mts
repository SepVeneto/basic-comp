// import sidebar from '../sidebar.json'
// import { mdPlugin } from './plugins'
import type { UserConfig } from 'vitepress'
import { mdPlugin, sidebar } from './config'

const buildTransformers = () => {
  const transformer = () => {
    return {
      props: [],
      needRuntime: true,
    }
  }

  const transformers = {}
  const directives = [
    'infinite-scroll',
    'loading',
    'popover',
    'click-outside',
    'repeat-click',
    'trap-focus',
    'mousewheel',
    'resize',
    'slots',
  ]
  directives.forEach((k) => {
    transformers[k] = transformer
  })

  return transformers
}

export const config: UserConfig = {
  title: 'Basic Comp说明文档1',
  description: 'Basic Comp说明文档',
  base: '/basic-comp/',
  scrollOffset: 1,
  themeConfig: {
    sidebar,
  },
  lang: 'zh-CN',

  markdown: {
    config: (md) => mdPlugin(md),
  },
  vue: {
    template: {
      ssr: true,
      compilerOptions: {
        directiveTransforms: buildTransformers(),
      },
    },
  },
}

export default config
