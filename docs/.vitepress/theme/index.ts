import BasicComp from '@sepveneto/basic-comp'
import ElementPlus, { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
// eslint-disable-next-line import/no-named-as-default
import DefaultTheme from 'vitepress/theme'
import { globals } from '../vitepress'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './custom.scss'

export default {
  extends: DefaultTheme,
  enhanceApp: async ({ app }) => {
    app.use(ElementPlus, {
      locale: zhCn,
    })
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
    app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
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
