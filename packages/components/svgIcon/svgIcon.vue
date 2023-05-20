<template>
  <span
    class="svg-container"
    :class="[{ 'is-disabled': disabled }]"
    :style="{ width, height }"
  >
    <slot />
    <svg
      v-if="!isIconFont && icon"
      :class="svgClass"
      :style="{ width, height }"
      aria-hidden="true"
      @click="$emit('click', $event)"
    >
      <use :xlink:href="iconName" />
    </svg>
    <i
      v-else-if="isIconFont && icon"
      :class="icon"
      aria-hidden="true"
      @click="$emit('click', $event)"
    />
    <span
      v-if="!icon"
      class="placeholder"
    />
    <div
      v-if="badge"
      class="svg-badge"
    >{{ badge }}</div>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { svgIconEmits, svgIconProps } from './type'

export default defineComponent({
  name: 'SvgIcon',
  props: svgIconProps,
  emits: svgIconEmits,
  computed: {
    isIconFont() {
      return this.icon && this.icon.includes('iconfont')
    },
    svgClass() {
      const { className } = this
      return className ? `svg-icon ${className}` : 'svg-icon'
    },
    iconName() {
      const { icon } = this
      const splitList = icon.split('-')
      const splitDict = icon.split('/')
      if (splitList && splitList.length !== 1) {
        return `#icon-${splitList[1]}`
      } else if (splitDict && splitDict.length !== 1) {
        const [dict, name] = splitDict
        const parseName = name && name.toLowerCase()
        return `#icon-${dict}${parseName.replace(/\S/, val => val.toUpperCase())}`
      }
      return `#icon-${icon}`
    },
  },
})
</script>
