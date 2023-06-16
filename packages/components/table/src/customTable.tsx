import type { PropType } from 'vue'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  ref,
  watch,
} from 'vue'
import type { TableColumnCtx } from 'element-plus/lib/components/table/src/table-column/defaults'
import { extractObject, getValue, logWarn, setValue } from '@basic-comp/utils'
import cellEdit from './cellEdit'
import { ElRadio, ElTable, ElTableColumn } from 'element-plus'
import { useSelection } from './useSelection'
// import useLazyStore from './useLazyStore';

export type RowType = {
  row: any,
  column: TableColumnCtx<unknown>,
  $index: number,
}

export default defineComponent({
  name: 'CustomTable',
  components: {
    CellEdit: cellEdit,
    ElTable,
    ElTableColumn,
    ElRadio,
  },
  props: {
    emptyText: {
      type: [String, Function],
      default: '',
    },
    rowSelection: {
      type: Object as PropType<{ preserveRowKeys?: boolean, selectedRowKeys: any[], onChange: (selection: any[], rows: any[], row: any) => void }>,
      default: () => ({
        selectedRowKeys: [],
        onChange: () => ({}),
      }),
    },
    rowKey: {
      type: [String, Function],
      default: undefined,
    },
    disableTravel: Boolean,
    bodyBorder: Boolean,
    wrapHeader: Boolean,
    showOverflowTooltip: Boolean,
    hiddenCurrent: Boolean,
    rowEdit: Boolean,
    banSelectAll: Boolean,
    customIcon: Boolean,
    data: {
      type: Array as PropType<Record<string, any>[]>,
      default: () => [],
    },
    config: {
      type: Array as PropType<Record<string, unknown>[]>,
      default: () => [],
    },
    htmlContent: Boolean,
  },
  emits: ['save', 'radio', 'select'],
  setup(props, context) {
    const tableConfig = ref<Record<string, unknown>[]>([])
    const radio = ref('')
    const instance = getCurrentInstance()

    const tableRef = ref()

    const rowSelection = ref()
    // const getRowKeyFn = computed(() => {
    //   if (typeof props.rowKey === 'function') {
    //     return props.rowKey
    //   }
    //   return row => {
    //     return (row as any)?.[props.rowKey as string]
    //   }
    // })
    watch(() => props.rowSelection, () => {
      rowSelection.value = props.rowSelection ? { ...props.rowSelection } : props.rowSelection
    }, { deep: true, immediate: true })
    // const [getRecordByKey] = useLazyStore(computed(() => props.data), getRowKeyFn)
    const [renderSelect, renderSelectTop] = useSelection(rowSelection, {
      pageData: computed(() => props.data),
      getRowKey,
      getRecordByKey: getRowByKey,
    })

    watch(() => props.config, (config) => {
      tableConfig.value = [...config]
    }, { immediate: true, deep: true })
    // watchEffect(() => {
    //   keySet.value = new Set(props.rowSelection.selectedRowKeys)
    // })

    function clearSelection() {
      tableRef.value.clearSelection()
    }
    function getRowKey(row: any, rowKey = props.rowKey, index?: number) {
      if (!rowKey) {
        console.warn('没有设置row-key')
        return index
      }
      if (typeof rowKey === 'function') {
        return rowKey(row)
      } else if (row[rowKey]) {
        return row[rowKey]
      } else {
        return false
      }
    }
    function getRowByKey(key: string) {
      return props.data.find((item: any) => getRowKey(item) === key)!
    }

    const renderRadio = (row: any, index: number, config: any) => (
      <el-radio
        model-value={radio.value}
        {...{
          'onUpdate:modelValue': (val: string) => {
            radio.value = val
            context.emit('radio', radio.value, row)
            context.emit('select', [row])
          },
        }}
        label={getRowKey(row, props.rowKey, index)}
        disabled={config.selectable ? !config.selectable(row) : false}
      ><span></span></el-radio>
    )
    const renderCellEdit = (row: any, column: TableColumnCtx<any>, config: any) => (
      <cell-edit
        modelValue={getValue(row, column.property, config, props.disableTravel)}
        onBlur={(val: string) => { setValue(row, column.property, val) }}
        onSave={(cell: string) => { instance?.parent?.emit('save', cell, column.property) }}
      />
    )

    const getColumnSlot = (data: RowType, config: any) => {
      if (config.children && config.children.length > 0) {
        return config.children.map((config: any) => transformTableColumn(config))
        // return tableColumns(config.children);
      }
      const { row, column, $index } = data
      if (config.type === 'expand') {
        return context.slots.expand?.(data)
      } else if (config.type === 'radio') {
        logWarn('[bc-table] radio将被弃用，请使用row-selection.type = \'radio\', 具体请参考https://sepveneto.github.io/basic-comp/components/table.html#%E5%8D%95%E9%80%89')
        // 不知道哪儿来的-1
        if (!~$index) {
          return
        }
        return renderRadio(row, $index, config)
      } else if (config.editable) {
        return renderCellEdit(row, column, config)
      }
      if (!column.property) {
        return null
      }
      const slot = context.slots[config.prop]
      const value = getValue(row, column.property, config, props.disableTravel)
      const realValue = typeof props.emptyText === 'function'
        ? props.emptyText(value, column)
        : (value === '' ? props.emptyText : value)
      return slot
        ? slot(data)
        : <span>{realValue}</span>
    }

    const transformTableColumn = (config: Record<string, unknown>): JSX.Element | null => {
      if (!config) {
        return null
      }
      if (config.type === 'select') {
        return (<el-table-column
          width="48px"
          v-slots={{
            default: (data: RowType) => renderSelect(data, config),
            header: () => renderSelectTop(),
          }}
        />)
      }
      if (config.type === 'selection') {
        return (<el-table-column {...config} />)
      }
      return (<el-table-column
        show-overflow-tooltip={props.showOverflowTooltip}
        v-slots={{
          default: (data: RowType) => getColumnSlot(data, config),
          header: ({ column, $index }: RowType) => {
            const header = context.slots[`${config.prop}-header`]
            return header ? header({ column, $index }) : <span>{column.label}</span>
          },
        }}
        {...extractObject(config, ['children'], 'exclude')}
      />)
    }
    context.expose({
      clearSelection,
      getRef: () => tableRef.value,
    })

    return {
      tableRef,
      tableConfig,
      transformTableColumn,
    }
  },
  render() {
    return (
      <el-table
        class={['custom-table', { 'cutom-icon': this.customIcon }, { 'current-hover': this.hiddenCurrent }]}
        ref="tableRef"
        border
        data={this.data}
        header-cell-class-name="custom-header"
        row-key={this.rowKey}
        onSelect={(...args: any) => this.$emit('select', args)}
        size="default"
        {...this.$attrs}
      >
        {this.tableConfig.map(config => this.transformTableColumn(config))}
      </el-table>
    )
  },
})
