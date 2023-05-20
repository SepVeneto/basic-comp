<template>
  <ElPagination
    class="bc-pagination"
    :background="background"
    style="text-align: right"
    :page-sizes="pageSizes"
    :layout="layout"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { ElPagination } from 'element-plus'
export default defineComponent({
  name: 'BcTablePagination',
  components: {
    ElPagination,
  },
  inheritAttrs: false,
  props: {
    pageSizes: {
      type: Array as PropType<number[]>,
      default: () => [5, 10, 20, 50],
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next, sizes, jumper',
    },
    background: {
      type: Boolean,
      default: true,
    },
  },
})
</script>
