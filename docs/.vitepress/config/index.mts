import sidebar from '../sidebar.json'
// import { mdPlugin } from './plugins'
import { defineConfig } from 'vitepress'
import { mdPlugin } from '../plugin'
import { getViteConfig } from './vite'

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

// export const config: UserConfig = {

// }

export default defineConfig({
  title: 'Basic Comp说明文档',
  description: 'Basic Comp说明文档',
  base: '/basic-comp/',
  scrollOffset: 1,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '组件', link: '/components/overview' },
      { text: '更新日志', link: '/changelog' },
    ],
    sidebar,
  },
  lang: 'zh-CN',

  markdown: {
    config: (md) => mdPlugin(md),
  },
  vite: getViteConfig(),
  vue: {
    template: {
      compilerOptions: {
        hoistStatic: false,
        directiveTransforms: buildTransformers(),
      },
    },
  },
})
