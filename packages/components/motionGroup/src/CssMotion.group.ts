import { defineComponent, Fragment, h } from 'vue'
import { motionGroupProps } from './type'

export default defineComponent({
  name: 'BcMotionGroup',
  props: motionGroupProps,
  setup(props, { slots }) {
    // 必须在返回的闭包内部执行，确保动态增删子节点时能触发更新
    return () => {
      const motionList = slots.default?.()
      
      motionList?.forEach((item, index) => {
        if ((item.type as any)?.name === 'BcMotion') {
          item.props = item.props || {};
          (item.props as Record<string, any>).delay = `${props.delay + props.step * index}s`
        }
      })
      
      return h(Fragment, null, motionList)
    }
  }
})