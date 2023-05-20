import type { App } from 'vue'
import components from './component'

const installer = function () {
  const install = (app: App) => {
    components.forEach(item => {
      app.use(item)
    })
  }
  return {
    install,
  }
}

export default installer()
