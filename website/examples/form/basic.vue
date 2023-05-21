<template>
  <bc-form :model="formData">
    <bc-form-item
      label="name"
      prop="name"
      required
    >
      <bc-input v-model="formData.name" />
    </bc-form-item>
  </bc-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const formData = ref({ name: '' })
</script>
