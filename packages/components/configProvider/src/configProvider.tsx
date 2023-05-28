import { defineComponent, reactive } from 'vue'
import { configProviderProps } from './type'
import { provideGlobalConfig } from '@basic-comp/hooks'

export default defineComponent({
  name: 'BcConfigProvider',
  props: configProviderProps,
  setup(props, { slots }) {
    const configProvider = reactive({
      ...props,
    })
    provideGlobalConfig(configProvider)
    return () => slots.default?.()
  },
})
