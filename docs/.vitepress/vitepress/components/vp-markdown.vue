<template>
  <div class="markdown-wrapper" v-html="parsed" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})
const parsed = computed(() => {
  return md.render(props.content)
})
</script>
