<template>
  <el-form :model="formData">
    <bc-form-item
      label="名称"
      prop="name"
      required
    >
      <bc-input v-model="formData.name" />
    </bc-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const formData = ref({ name: '' })
</script>
