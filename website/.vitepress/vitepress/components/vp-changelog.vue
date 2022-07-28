<template>
  <div class="changelogs">
    <ClientOnly>
      <el-skeleton :loading="loading">
        <div>
          <p>选择一个版本</p>
          <el-select
            :model-value="currentRelease.name"
            placeholder="选择一个版本"
            style="width: 200px"
            @change="onVersionChange"
          >
            <el-option
              v-for="release in releases"
              :key="release.node_id"
              :value="release.name"
            >{{release.name}}</el-option>
          </el-select>
        </div>
        <el-card v-if="currentRelease">

        </el-card>
      </el-skeleton>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
const loading = ref(true)
const currentRelease = ref()
const releases = ref([])

function onVersionChange(val) {
  console.log(val)
  const _releases = releases.value
  currentRelease.value = _releases[_releases.findIndex((r) => r.name === val)]
}

onMounted(async() => {
  try {
    const { data } = await axios.get(
      'https://api.github.com/repos/SepVeneto/vue-tools-ts/tags'
    )
    releases.value = data
    console.log(data)
    currentRelease.value = data[0]
  } catch(e) {
    console.log(e)
    releases.value = []
    currentRelease.value = undefined
  } finally {
    loading.value = false
  }
})

</script>
