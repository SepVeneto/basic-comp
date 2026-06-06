<template>
  <ElRadioGroup
    v-if="!onlyDisplay"
    :model-value="modelValue"
    :style="{ width: radioGroupWidth }"
    v-bind="{ clearable: true, valueKey: optionKey, ...$attrs }"
    @update:model-value="emitValue"
    @change="emitLabel"
  >
    <template v-if="type === 'radio'">
      <ElRadio
        v-for="item in radioOptions"
        :key="item[optionKey || optionValue]"
        :label="item[optionKey || optionValue]"
        :value="item[optionValue] == null ? item : item[optionValue]"
        :disabled="itemDisabled && itemDisabled(item)"
      >
        <slot v-bind="item">
          {{ hasValue(item) }}
        </slot>
      </ElRadio>
    </template>
    <template v-else-if="type === 'button'">
      <ElRadioButton
        v-for="item in radioOptions"
        :key="item[optionKey || optionValue]"
        :label="item[optionKey || optionValue]"
        :value="item[optionValue] == null ? item : item[optionValue]"
        :disabled="itemDisabled && itemDisabled(item)"
      >
        <slot v-bind="item">
          {{ hasValue(item) }}
        </slot>
      </ElRadioButton>
    </template>
  </ElRadioGroup>
  <span v-else>{{ displayText }}</span>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { getValue, logWarn } from '@basic-comp/utils'
import type { RadioGroupOption, RadioGroupOptions } from './type'
import { radioGroupProps } from './type'
import { useConfigInject } from '@basic-comp/hooks'
import { ElRadio, ElRadioButton, ElRadioGroup } from 'element-plus'

export default defineComponent({
  name: 'BcRadioGroup',
  components: {
    ElRadio,
    ElRadioButton,
    ElRadioGroup,
  },
  props: radioGroupProps,
  emits: ['update:modelValue', 'update:label', 'fetch', 'change'],
  setup(props, context) {
    const radioGroupInject = useConfigInject('select')
    const responseInject = useConfigInject('response')

    const arrayName = computed(() =>
      radioGroupInject.value?.arrayName || props.arrayName,
    )
    const optionLabel = computed(() =>
      radioGroupInject.value?.label || props.customLabel,
    )
    const optionValue = computed(() =>
      radioGroupInject.value?.value || props.customValue,
    )
    const apis = computed(() =>
      radioGroupInject.value?.apis || {},
    )

    const optionsName = computed(() =>
      (props.arrayName || arrayName.value) ?? '',
    )
    const responseWrap = computed(() =>
      responseInject.value?.data || 'data',
    )
    const apiOptions = ref<RadioGroupOptions>([])

    type OptionItem = Exclude<RadioGroupOption, string | number>
    const radioOptions = computed<OptionItem[]>(() => {
      const labelName = optionLabel.value
      const valueName = optionValue.value
      const options = props.options || apiOptions.value || []
      const res = []
      for (const item of options) {
        if (typeof item !== 'object') {
          res.push({
            [labelName]: item,
            [valueName]: item,
          })
        } else {
          res.push(item)
        }
      }
      return res
    })
    const needGroup = computed(() => {
      if (!props.group) {
        return false
      }
      return radioOptions.value.some(item => item.children)
    })
    const displayText = computed(() => {
      const value = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
      const res:(string | number)[] = []
      value.forEach(item => {
        let obj: OptionItem = {}
        obj = radioOptions.value.find(each => each[optionValue.value] === item) || {}
        res.push(obj ? obj[optionLabel.value] as string : '')
      })
      return res.join(',')
    })
    const radioGroupWidth = computed(() => {
      if (!props.width) {
        return ''
      }
      if (typeof props.width === 'string') {
        return props.width
      } else {
        return props.width + 'px'
      }
    })

    props.immediate && getList()
    props.defaultValue && context.emit('update:modelValue', props.defaultValue)

    function getList() {
      let api = props.api
      if (typeof props.api === 'string') {
        api = apis.value[props.api]
      }
      if (typeof api === 'function') {
        api().then((data) => {
          const response = data[responseWrap.value] as Record<string, RadioGroupOption[]> | RadioGroupOption[]
          if (!response) {
            logWarn('[radio-group]api返回值异常')
            return
          }
          if (Array.isArray(response) && response) {
            apiOptions.value = response
          } else if (response instanceof Object) {
            apiOptions.value = response[optionsName.value]
          } else {
            logWarn('[radio-group]api返回值解析失败')
          }
          context.emit('fetch', apiOptions.value)
        })
      }
    }
    function hasValue(item: Record<string, any>): string {
      const value = getValue(item, optionLabel.value)
      if (value === '' || !!value) {
        return value
      } else {
        return typeof item === 'object' ? '' : item
      }
    }
    function getObject(value: unknown) {
      if (typeof value === 'object') {
        return value
      }
      const res = radioOptions.value.find(item => item[optionValue.value] === (value || props.modelValue))
      if (!res) {
        return {}
      }
      return res
    }
    function getLabel(val?: unknown) {
      const value = val || props.modelValue
      if (Array.isArray(value)) {
        return value.reduce((res, curr) => {
          const result = radioOptions.value.find(item => item[optionValue.value] === curr) || {}
          if (!result) {
            res.push('')
          }
          res.push(result[optionLabel.value])
          return res
        }, [])
      } else {
        const res = radioOptions.value.find(item => item[optionValue.value] === value)
        if (!res) {
          return ''
        }
        return res[optionLabel.value]
      }
    }
    function getOptions() {
      return radioOptions.value
    }
    function emitValue(val: unknown) {
      context.emit('update:modelValue', val)
      context.emit('change', val, getObject(val))
    }
    function emitLabel(val: unknown) {
      context.emit('update:label', getLabel(val))
    }

    context.expose({
      getOptions,
      getLabel,
    })

    return {
      needGroup,
      displayText,
      radioOptions,
      radioGroupWidth,
      optionValue,
      hasValue,

      getObject,
      getLabel,
      getOptions,
      emitLabel,
      emitValue,
    }
  },
})
</script>
