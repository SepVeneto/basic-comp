<template>
  <bc-input v-model="text" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
defineOptions({
  name: 'Basic',
})
const text = ref('')
</script>
