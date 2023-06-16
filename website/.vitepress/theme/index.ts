import BasicComp from '@sepveneto/basic-comp'
import ElementPlus from 'element-plus'

import VPApp, { globals } from '../vitepress'

export default {
  Layout: VPApp,
  enhanceApp: async ({ app }) => {
    app.use(ElementPlus, {
      // locale: await import('element-plus/es/locale/lang/zh-cn')
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
