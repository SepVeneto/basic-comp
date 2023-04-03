import { ComponentInternalInstance } from "vue";
import { RenderInputConfigType } from "@basic-comp/components/search";
import { BcSelect, BcInput, BcDatePicker } from '@basic-comp/components'
import { getValue, setValue } from '@basic-comp/utils'

export type RenderContextType = {
  handleSearch?: () => void,
  updateData?: (key: string, val: string | string[]) => void,
  context: ComponentInternalInstance | null,
} | null;

function updateData(
  params: Record<string, unknown>,
  prop: string,
  val: string | string[],
  context: RenderContextType
) {
  if (context?.updateData) {
    context.updateData(prop, val);
  } else {
    setValue(params, prop, val)
  }
}
function handleSearch(context: RenderContextType) {
  if (context?.handleSearch) {
    context.handleSearch();
  }
}

export const renderUnit = (
  h: unknown,
  value: Record<string, unknown>,
  config: RenderInputConfigType,
  context: RenderContextType,
) => {
  const { catalog, prop, name, options, ...params } = config;
  const modelValue = getValue(value, prop)
  if (catalog === 'input') {
    return <BcInput
      model-value={modelValue}
      placeholder={name}
      {...{
        ...params,
        'onUpdate:modelValue': (val: string) => updateData(value, prop, val, context),
      }}
      onkeyup={(e: KeyboardEvent) => e.code === 'Enter' && handleSearch(context)}
      // {...{ : params }}
    />
  } else if (catalog === 'select') {
    return <BcSelect
      model-value={modelValue}
      placeholder={name}
      {...{
        'onUpdate:modelValue': (val: string | string[]) => updateData(value, prop, val, context),
        onChange: () => handleSearch(context),
      }}
      options={config.options}
      { ...params }
    />
  } else if (catalog === 'datepicker') {
    return <BcDatePicker
      model-value={modelValue}
      placeholder={name}
      {...{
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        rangeSeparator: '至',
        ...params,
        'onUpdate:modelValue': (val: string) => updateData(value, prop, val, context),
        onChange: () => handleSearch(context),
      }}
      {...params}
    />
  } else {
    return context?.context?.slots[config.prop] || context?.context?.parent?.slots?.[config.prop]?.();
  }
};
