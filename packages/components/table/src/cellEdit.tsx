import { defineComponent, ref } from 'vue'
import { Select as IconSelect } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'BcTableCellEdit',
  directives: {
    focus: {
      mounted: el => {
        el.querySelector('input').focus()
      },
    },
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    unit: {
      type: String,
      default: undefined,
    },
  },
  emits: ['save', 'blur'],
  setup(props, context) {
    const editing = ref(false)
    const cell = ref<string | number>('')
    const inputRef = ref()

    function toggleEdit() {
      editing.value = !editing.value
    }
    function save() {
      context.emit('save', cell.value)
      toggleEdit()
    }

    const editInput = () => (
      <bc-input
        class="bc-table-input"
        ref={inputRef}
        model-value={cell.value}
        v-focus
        v-slots={{
          suffix: () => <el-icon
              class="bc-table-input--operate"
              color="var(--el-color-success)"
              onClick={save}
            ><IconSelect /></el-icon>,
        }}
        {...{
          'onUpdate:modelValue': (val: string) => { cell.value = val },
          onFocus: () => { cell.value = props.modelValue },
          onBlur: () => { editing.value && toggleEdit() },
          onKeyup: (e: KeyboardEvent) => { e.code.includes('Enter') && save() },
        }}
      >
      </bc-input>
    )
    const displayInput = () => (
      <div class="bc-table-cell-edit" onClick={toggleEdit}>{props.modelValue}</div>
    )
    return () => editing.value ? editInput() : displayInput()
  },
})
