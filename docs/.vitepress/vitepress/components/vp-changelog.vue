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
              :key="release.id"
              :value="release.name"
            >{{release.name}}</el-option>
          </el-select>
        </div>
        <el-card v-if="currentRelease">
          <div>
            <VPMarkdown :content="currentRelease.body" />
          </div>
        </el-card>
      </el-skeleton>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import VPMarkdown from './vp-markdown.vue'

interface Release {
  id: number
  name: string
}

const loading = ref(true)
const currentRelease = ref()
const releases = ref<Release[]>([])

function onVersionChange(val) {
  const _releases = releases.value
  currentRelease.value = _releases[_releases.findIndex((r) => r.name === val)]
  console.log(currentRelease.value)
}

onMounted(async() => {
  try {
    const { data } = await axios.get<Release[]>(
      'https://api.github.com/repos/SepVeneto/basic-comp/releases'
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
