<template>
  <p><bc-date-picker v-model="defaultValue" day-end type="datetimerange" /></p>
  <p><bc-date-picker v-model="value" day-end type="datetimerange" /></p>
  <p><bc-date-picker v-model="value2" :default-time="defaultTime" type="datetimerange" /></p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref([])
const value2 = ref([])
const defaultTime = [new Date(2000, 1, 1, 8,30,0), new Date(2000, 1, 1, 17,30,0)]
const defaultValue = ref(['2022-03-04', '2022-03-05'])
</script>
