import type { ComputedRef, Ref, VNode } from 'vue'
import type { DefaultRow, RowType, TableRowSelection } from './type'
import { ElCheckbox, ElRadio } from 'element-plus'
import { computed, h, shallowRef, watchEffect } from 'vue'

type Key = string | number

export function useSelection<T extends DefaultRow>(
  rowSelectionRef: Ref<TableRowSelection<T> | undefined>,
  configRef: {
    getRowKey: (row: Record<string, any>) => string
    pageData: ComputedRef<Record<string, any>[]>
    getRecordByKey: (key: string) => Record<string, any>
  },
): [(data: RowType, config: Record<string, any>) => VNode, () => VNode | null] {
  const { getRowKey, pageData } = configRef

  const mergedRowSelection = computed(() => {
    const tmp = rowSelectionRef.value ?? {}
    return { type: 'checkbox', ...tmp }
  })

  const mergedSelectedKeys = computed(() => {
    return mergedRowSelection.value.selectedRowKeys as Key | Key[]
  })

  const selectKeysState = computed(() => {
    return mergedSelectedKeys.value
  })

  const derivedSelectedKey = computed(() => selectKeysState.value)

  const derivedSelectedKeySet = computed(() => {
    const keys = derivedSelectedKey.value
    return new Set(Array.isArray(keys) ? keys : [keys])
  })

  const preserveRecords = shallowRef(new Map<any, Record<string, any>>())

  const rowKeys = computed(() => {
    return pageData.value
      .map(item => getRowKey(item))
      .filter(key => !isCheckboxDisabled(key))
  })

  const checkboxPropsMap = computed(() => {
    const getCheckboxProps = mergedRowSelection.value.getCheckboxProps
    const map = new Map()
    pageData.value.forEach((row) => {
      const key = getRowKey(row)
      const checkboxProps = getCheckboxProps?.(row) || {}
      map.set(key, checkboxProps)
    })
    return map
  })

  const isCheckboxDisabled = (key: Key) => !!checkboxPropsMap.value.get(key)?.disabled

  watchEffect(() => {
    const keys = mergedSelectedKeys.value
    updateRecordsCache(Array.isArray(keys) ? keys : [keys])
  })

  function updateRecordsCache(keys: any[]) {
    if (mergedRowSelection.value.preserveRowKeys) {
      const newCache = new Map<any, Record<string, any>>()
      keys.forEach((key) => {
        let record = configRef.getRecordByKey(key)
        if (!record && preserveRecords.value.has(key)) {
          record = preserveRecords.value.get(key)!
        }
        newCache.set(key, record)
      })
      preserveRecords.value = newCache
    }
  }

  function setSelectedKeys(keys: any[], record?: RowType) {
    let avaliableKeys: any[] = []
    let records: Record<string, any>[] = []
    updateRecordsCache(keys)
    const { preserveRowKeys, onChange: onSelectionChange } = mergedRowSelection.value
    if (preserveRowKeys) {
      avaliableKeys = keys
      records = keys.map(key => preserveRecords.value.get(key)!)
    }
    else {
      keys.forEach((key) => {
        const record = configRef.getRecordByKey(key)
        if (record !== undefined) {
          avaliableKeys.push(key)
          records.push(record)
        }
      })
    }
    onSelectionChange?.(avaliableKeys, records, record)
  }

  function setSelectedKey(key: any, record?: RowType) {
    const { onChange: onSelectionChange } = mergedRowSelection.value
    onSelectionChange?.(key, record)
  }

  // ==== 渲染相关逻辑优化改造 ====

  function renderCell({ row }: RowType, _config: Record<string, any>) {
    return mergedRowSelection.value.type === 'radio' ? renderRadio(row) : renderCheckbox(row)
  }

  function renderRadio(row: RowType['row']) {
    const keySelected = derivedSelectedKey.value
    const key = getRowKey(row)
    const options = mergedRowSelection.value.getCheckboxProps?.(row) || {}

    function onRowSelect() {
      setSelectedKey(key, row)
    }

    return h(ElRadio, {
      ...options,
      label: true,
      modelValue: key === keySelected,
      onClick: (e: MouseEvent) => e.stopPropagation(),
      onChange: () => onRowSelect(),
    }, () => '')
  }

  function renderCheckbox(row: RowType['row']) {
    const keySet = new Set(derivedSelectedKeySet.value)
    const key = getRowKey(row)
    const options = mergedRowSelection.value.getCheckboxProps?.(row) || {}

    function onRowSelect() {
      const rowkey = getRowKey(row)
      if (keySet.has(rowkey)) {
        keySet.delete(rowkey)
      }
      else {
        keySet.add(rowkey)
      }
      setSelectedKeys(Array.from(keySet), row)
    }

    return h(ElCheckbox, {
      ...options,
      modelValue: keySet.has(key),
      onClick: (e: MouseEvent) => e.stopPropagation(),
      onChange: () => onRowSelect(),
    })
  }

  function renderTop() {
    if (mergedRowSelection.value.type === 'radio') {
      return null
    }

    const keySet = new Set(derivedSelectedKeySet.value)

    // 性能优化：原代码在 renderTop() 被调用时重复创建 computed 监听器，
    // 这里直接平铺为普通表达式，跟随 render 执行时实时计算快照即可。
    const disabledChecked = rowKeys.value.length === 0
    const checkedCurrentAll = rowKeys.value.every((key: string) => keySet.has(key))
    const checkedCurrentSome = rowKeys.value.some((key: string) => keySet.has(key))

    function onSelectAllChange() {
      if (checkedCurrentAll) {
        rowKeys.value.forEach((key) => {
          keySet.delete(key)
        })
      }
      else {
        rowKeys.value.forEach((key) => {
          if (!keySet.has(key)) {
            keySet.add(key)
          }
        })
      }
      setSelectedKeys(Array.from(keySet))
    }

    return h(ElCheckbox, {
      modelValue: checkedCurrentAll && !disabledChecked,
      indeterminate: !checkedCurrentAll && checkedCurrentSome,
      onChange: onSelectAllChange,
      disabled: disabledChecked,
    })
  }

  return [renderCell, renderTop]
}
