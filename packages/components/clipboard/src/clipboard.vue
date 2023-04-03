<template>
  <div @click="handleClick"><slot /></div>
</template>

<script lang="ts">
import { copyText } from '@basic-comp/utils';
import { defineComponent } from 'vue';
import { clipboardProps } from './type';
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'BcClipboard',
  props: clipboardProps,
  setup(props) {
    function handleClick() {
      let text = '';
      if (props.text) {
        text = props.text;
      } else {
        if (!props.dom) {
          console.warn('非法选择器')
          return;
        }
        const contentDom = document.body.querySelector(props.dom);
        text = contentDom?.textContent || (contentDom as HTMLInputElement)?.value;
      }
      copyText(text).then(() => {
        props.success?.();
        ElMessage.success(props.message)
      }).catch(err => {
        console.error(err)
      })
    }
    return {
      handleClick
    }
  },
})
</script>