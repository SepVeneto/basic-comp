<template>
  <aside class="menu">
    <a 
      :class="['menu-item', {active: isActive(route, item.link)}]"
      v-for="item in sidebar"
      :key="item.link"
      :index="item.link"
      :href="item.link"
    >{{item.name}}</a>
  </aside>
</template>

<script lang="ts">
import { useRoute } from 'vitepress';
import type { Route } from 'vitepress';
import { defineComponent } from 'vue'
import { useSidebar } from '../hooks/sidebar';
export default defineComponent({
  name: 'VPSidebar',
  setup() {
    const { sidebar } = useSidebar()
    const route = useRoute()

    function isActive(curr: Route, route: string) {
      return curr.path.includes(route)
    }
    return {
      isActive,
      route,
      sidebar,
    }
  }
})
</script>

<style lang="scss" scoped>
.menu {
  width: 200px;
  padding-left: calc((100% - 1376px) / 2);
  margin-right: 20px;
  .menu-item {
    display: block;
    padding: 15px;
    text-decoration: none;
    color: #333;
    &:active, &:visited {
      color: #333;
    }
    &:hover {
      color: #409eff;
    }
    &.active {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-8);
    }
  }
}
</style>
