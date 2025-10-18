import path from 'path'
import type { Alias } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { indexRoot, pkgRoot } from '../constants'
import { MarkdownTransform } from '../plugin/markdown-transform'

const alias: Alias[] = []
if (process.env.DOC_ENV !== 'production') {
  alias.push(
    {
      find: /^@sepveneto\/basic-comp(\/(es|lib))?$/,
      replacement: path.resolve(indexRoot, 'index.ts'),
    },
    {
      find: /^@sepveneto\/basic-comp\/(es|lib)\/(.*)$/,
      replacement: `${pkgRoot}/$2`,
    },
  )
}

export const getViteConfig = () => ({
  server: {
    host: true,
    port: 3333,
    fs: {
      strict: true,
      // 需要访问根目录node_modules中element-plus的字体文件
      allow: [path.resolve(__dirname, '..')],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  plugins: [
    // Components({
    //   dirs: ['.vitepress/vitepress/components'],
    //   allowOverrides: true,
    //   include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    // }),
    vueJsx(),
    MarkdownTransform(),
  ],
  resolve: {
    alias: [
      {
        find: 'packages',
        replacement: path.resolve(__dirname, '../packages'),
      },
      ...alias,
    ],
  },
})
