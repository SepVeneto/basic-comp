<template>
  <div class="bc-status">
    <i
      class="bc-status--icon"
      :class="iconClass"
    />
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'BcStatus',
  props: {
    type: {
      type: String as PropType<'primary' | 'error' | 'info' | 'warning' | 'success'>,
      default: 'primary',
    },
  },
  setup(props) {
    const iconClass = computed(() => {
      return `bc-status--${props.type}`
    })
    return {
      iconClass,
    }
  },
})
</script>
