<template>
  <ElSelect
    v-if="!onlyDisplay"
    :model-value="modelValue"
    :style="{ width: selectWidth }"
    v-bind="{ clearable: true, valueKey: optionKey, ...$attrs }"
    @update:model-value="emitValue"
    @change="emitLabel"
  >
    <template v-if="needGroup">
      <ElOptionGroup
        v-for="(groupOptions, index) in selectOptions"
        :key="index"
        :label="hasValue(groupOptions)"
        :value="groupOptions[optionValue] == null ? groupOptions : groupOptions[optionValue]"
      >
        <ElOption
          v-for="item in groupOptions.children"
          :key="item[optionKey || optionValue]"
          :label="hasValue(item)"
          :value="item[optionValue] == null ? item : item[optionValue]"
          :disabled="itemDisabled && itemDisabled(item)"
        >
          <slot v-bind="{ ...item }" />
        </ElOption>
      </ElOptionGroup>
    </template>
    <template v-else>
      <ElOption
        v-for="item in selectOptions"
        :key="item[optionKey || optionValue]"
        :label="hasValue(item)"
        :value="item[optionValue] == null ? item : item[optionValue]"
        :disabled="itemDisabled && itemDisabled(item)"
      >
        <slot v-bind="{ ...item }" />
      </ElOption>
    </template>
  </ElSelect>
  <span v-else>{{ displayText }}</span>
</template>

<script lang="ts">
// import serverSelect from './serverSelect';
import { computed, defineComponent, ref } from 'vue'
import { getValue, logWarn } from '@basic-comp/utils'
import type { SelectOption, SelectOptions } from './type'
import { selectProps } from './type'
import { useConfigInject } from '@basic-comp/hooks'
import { ElOption, ElOptionGroup, ElSelect } from 'element-plus'

export default defineComponent({
  name: 'BcSelect',
  components: {
    ElSelect,
    ElOption,
    ElOptionGroup,
  },
  props: selectProps,
  emits: ['update:modelValue', 'update:label', 'fetch', 'change'],
  setup(props, context) {
    const selectInject = useConfigInject('select')
    const responseInject = useConfigInject('response')

    const arrayName = computed(() =>
      selectInject.value?.arrayName || props.arrayName,
    )
    const optionLabel = computed(() =>
      selectInject.value?.label || props.customLabel,
    )
    const optionValue = computed(() =>
      selectInject.value?.value || props.customValue,
    )
    const apis = computed(() =>
      selectInject.value?.apis || {},
    )

    const optionsName = computed(() =>
      (props.arrayName || arrayName.value) ?? '',
    )
    const responseWrap = computed(() =>
      responseInject.value?.data || 'data',
    )
    const apiOptions = ref<SelectOptions>([])

    const selectOptions = computed<SelectOptions>(() => {
      return [...(props.options || apiOptions.value || [])]
    })
    const needGroup = computed(() => {
      if (!props.group) {
        return false
      }
      return selectOptions.value.some(item => item.children)
    })
    const displayText = computed(() => {
      const value = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
      const res:(string | number)[] = []
      value.forEach(item => {
        let obj: SelectOption = {}
        if (props.modelValue instanceof Object) {
          obj = props.modelValue as SelectOption
        } else {
          obj = selectOptions.value.find(each => each[optionValue.value] === item) || {}
        }
        res.push(obj ? obj[optionLabel.value] as string : '')
      })
      return res.join(',')
    })
    const selectWidth = computed(() => {
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
          const response = data[responseWrap.value] as Record<string, SelectOption[]> | SelectOption[]
          if (!response) {
            logWarn('[select]api返回值异常')
            return
          }
          if (Array.isArray(response) && response) {
            apiOptions.value = response
          } else if (response instanceof Object) {
            apiOptions.value = response[optionsName.value]
          } else {
            logWarn('[bc-select]api返回值解析失败')
          }
          context.emit('fetch', apiOptions.value)
        })
      }
    }
    function hasValue(item: SelectOption): string {
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
      const res = selectOptions.value.find(item => item[optionValue.value] === (value || props.modelValue))
      if (!res) {
        return {}
      }
      return res
    }
    function getLabel(val?: unknown) {
      const value = val || props.modelValue
      if (Array.isArray(value)) {
        return value.reduce((res, curr) => {
          const result = selectOptions.value.find(item => item[optionValue.value] === curr) || {}
          if (!result) {
            res.push('')
          }
          res.push(result[optionLabel.value])
          return res
        }, [])
      } else {
        const res = selectOptions.value.find(item => item[optionValue.value] === value)
        if (!res) {
          return ''
        }
        return res[optionLabel.value]
      }
    }
    function getOptions() {
      return selectOptions.value
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
      selectOptions,
      selectWidth,
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
