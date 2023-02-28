import { computed, defineComponent, ref } from 'vue'
import { inputProps } from './type';
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElInput, ElMessage } from 'element-plus'
// import '../style.css'
import { copyText } from '@basic-comp/utils';

export default defineComponent({
  name: 'BcInput',
  props: inputProps,
  inheritAttrs: false,
  components: {
    DocumentCopy,
    ElInput
  },
  setup(props, context) {
    const inputRef = ref<InstanceType<typeof ElInput>>();

    const inputWidth = computed(() => {
      if (typeof props.width === 'number') {
        return `${props.width}px`;
      }
      return props.width;
    });

    const borderClass = {
      none: 'no-border',
      bottom: 'bottom-border',
      all: '',
    }[props.border];
    const copyOptions = typeof props.copy === 'boolean' ? { size: 20 } : props.copy
    const suffix = () => (
      <>
        {props.copy &&
          <el-tooltip content="复制">
            <el-icon
              style="cursor: pointer"
              size={copyOptions.size ?? 20}
              color={copyOptions.color}
              onClick={handleCopy}
            >
              {context.slots.icon?.() ?? <document-copy />}
            </el-icon>
          </el-tooltip>
        }
        {context.slots.suffix?.()}
      </>
    )
    async function handleCopy() {
      if (inputRef.value) {
        const text = inputRef.value.input?.value ?? ''
        await copyText(String(text))
        ElMessage.success('复制成功')
      }
    }
    return {
      inputRef,
      borderClass,
      inputWidth,

      suffix
    }
  },
  render() {
    const input = () => (
      <el-input
        ref={el => this.inputRef = el}
        class={['bc-input', this.borderClass]}
        style={{width: this.inputWidth}}
        placeholder='请输入'
        spellcheck={false}
        {...this.$attrs}
        v-slots={{
          ...this.$slots,
          // suffix: () => context.slots.suffix?.()
          suffix: this.suffix,
        }}
      />
    )
    const text = () => (
      <span>{this.$attrs.modelValue}</span>
    )
    return this.onlyDisplay ? text() : input();
  }
})