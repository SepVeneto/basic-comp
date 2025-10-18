import BasicComp from '@sepveneto/basic-comp'
import ElementPlus from 'element-plus'
// eslint-disable-next-line import/no-named-as-default
import DefaultTheme from 'vitepress/theme'
import { globals } from '../vitepress'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp: async ({ app }) => {
    app.use(ElementPlus, {
      locale: zhCn,
    })
    app.use(BasicComp, {
      select: {
        apis: {
          merchant: () => Promise.resolve({ data: [{ labe: 1, value: 1 }] }),
        },
      },
    })

    globals.forEach(([comp, name]) => {
      app.component(name, comp)
    })
  },
}
