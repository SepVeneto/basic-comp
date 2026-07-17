import { defineComponent } from 'vue'
import type { Component, PropType } from 'vue'
import type { TableColumnInstance } from 'element-plus'
import { ElTable, ElTableColumn } from 'element-plus'

type ElTableColumnProps = TableColumnInstance['$props']

const SimpleTable: Component = defineComponent({
  name: 'SimpleTable',
  components: {
    ElTable,
    ElTableColumn,
  },
  props: {
    data: {
      type: Array as PropType<any[]>,
      default: () => ([]),
    },
    config: {
      type: Object as PropType<ElTableColumnProps[]>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <ElTable
        data={props.data}
      >
        {props.config.map(config => (
          <ElTableColumn {...config } />
        ))}
      </ElTable>
    )
  },
})

export default SimpleTable
