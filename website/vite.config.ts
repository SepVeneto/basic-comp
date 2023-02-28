import path from 'path'
// import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vite'
// import { projRoot } from './.vitepress/utils/paths'
import type { Alias } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {
  indexRoot,
  pkgRoot,
} from '../build/pkg'

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

export default defineConfig({
  server: {
    host: true,
    port: 3333,
    fs: {
      strict: true,
      // 需要访问根目录node_modules中element-plus的字体文件
      allow: [path.resolve(__dirname, '..')],
    },
  },
  plugins: [
    vueJsx()
  ],
  resolve: {
    alias: [
      {
        find: 'packages',
        replacement: path.resolve(__dirname, '../packages')
      },
      ...alias,
    ]
  },
  // plugins: [Inspect()],
  // optimizeDeps: {
  //   include: ['@vueuse/core', 'dayjs'],
  // },
})
