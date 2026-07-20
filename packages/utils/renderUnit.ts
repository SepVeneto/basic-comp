import type { SetupContext, Slot, VNode } from 'vue'
import { h } from 'vue' // 引入原生的 h 函数
import type { NameMode, RenderInputConfigType } from '@basic-comp/components/search'
import { BcDatePicker, BcInput, BcSelect } from '@basic-comp/components'
import { getValue, setValue } from '@basic-comp/utils'

export type RenderContextType = {
  nameMode: NameMode,
  handleSearch?: () => void,
  updateData?: (key: string, val: string | string[]) => void,
  context: SetupContext,
} | null

function updateData(
  params: Record<string, unknown>,
  prop: string,
  val: string | string[],
  context: RenderContextType,
) {
  if (context?.updateData) {
    context.updateData(prop, val)
  } else {
    setValue(params, prop, val)
  }
}

function handleSearch(context: RenderContextType) {
  if (context?.handleSearch) {
    context.handleSearch()
  }
}

export const renderUnit = (
  _h: unknown, // 保持签名不变，向下兼容原有调用，内部直接用上面 import 的原生 h
  value: Record<string, unknown>,
  config: RenderInputConfigType,
  context: RenderContextType,
): VNode | Slot | undefined | null | VNode[] => {
  const { catalog, prop, name, options, ...params } = config
  const modelValue = getValue(value, prop)

  // 计算统一的 placeholder 逻辑
  const placeholder = context?.nameMode === 'placeholder' ? name : params.placeholder

  if (catalog === 'input') {
    return h(BcInput, {
      ...params,
      modelValue: modelValue,
      placeholder: placeholder,
      'onUpdate:modelValue': (val: string) => updateData(value, prop, val, context),
      onKeyup: (e: KeyboardEvent) => e.code === 'Enter' && handleSearch(context),
    })
  } 
  
  if (catalog === 'select') {
    return h(BcSelect, {
      ...params,
      options: options,
      modelValue: modelValue,
      placeholder: placeholder,
      'onUpdate:modelValue': (val: string | string[]) => updateData(value, prop, val, context),
      onChange: () => handleSearch(context),
    })
  } 
  
  if (catalog === 'datepicker') {
    return h(BcDatePicker, {
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      rangeSeparator: '至',
      ...params,
      modelValue: modelValue,
      'onUpdate:modelValue': (val: string) => updateData(value, prop, val, context),
      onChange: () => handleSearch(context),
    })
  } 
  
  const slots = context?.context?.slots[config.prop]?.() || null
  return slots
}
