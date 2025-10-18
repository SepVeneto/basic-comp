import 'normalize.css'

import '../../../packages/theme-chalk/src/index.scss'
import 'prismjs/themes/prism.css'
import './style/index.scss'
import 'element-plus/theme-chalk/index.css'

import VPApp from './components/vp-app.vue'
import VPDemo from './components/vp-demo.vue'
import VPChangelog from './components/vp-changelog.vue'
import Overview from './components/overview.vue'

export default VPApp
export const globals = [
  [Overview, 'Overview'],
  [VPDemo, 'Demo'],
  [VPChangelog, 'VpChangelog'],
]
