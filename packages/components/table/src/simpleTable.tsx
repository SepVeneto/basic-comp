import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import type { ExtractProps } from '@basic-comp/utils'

type ElTableColumnProps = ExtractProps<typeof ElTableColumn>

export default defineComponent({
  name: 'SimpleTable',
  components: {
    ElTable,
    ElTableColumn,
  },
  props: {
    data: {
      type: Array,
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
          <ElTableColumn {...config} />
        ))}
      </ElTable>
    )
  },
})
