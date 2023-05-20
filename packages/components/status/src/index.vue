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
export default defineComponent({
  name: 'BcStatus',
  props: {
    type: {
      type: String,
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
