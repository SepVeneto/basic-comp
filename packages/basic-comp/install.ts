import type { App } from 'vue'
import components from './component'
import type { ConfigProviderProps } from '@basic-comp/components'
import { provideGlobalConfig } from '@basic-comp/hooks'

const installer = function () {
  const install = (app: App, options: ConfigProviderProps) => {
    components.forEach(item => {
      app.use(item as any)
    })
    if (options) provideGlobalConfig(options, app)
  }
  return {
    install,
  }
}

export default installer()
