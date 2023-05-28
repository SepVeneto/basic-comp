import type { App } from 'vue'
import components from './component'
import { type ConfigProviderProps } from '../components'
import { provideGlobalConfig } from '../hooks'

const installer = function () {
  const install = (app: App, options: ConfigProviderProps) => {
    components.forEach(item => {
      app.use(item)
    })
    if (options) provideGlobalConfig(options, app)
  }
  return {
    install,
  }
}

export default installer()
