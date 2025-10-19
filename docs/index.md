---
title: Basic-components
layout: home

hero:
  name: "Basic Components"
  text: "基于Element的组件库"
  tagline: 对element-plus的部分组件进行功能扩展
  actions:
    - theme: brand
      text: 组件总览
      link: /components/overview
    - theme: alt
      text: 更新日志
      link: /changelog
---

# 快速开始

## 环境支持

由于是对`element-plus`的二次封装，同时基于`vue3`，因此不支持ie11

| ![IE](https://cdn.jsdelivr.net/npm/@browser-logos/edge/edge_32x32.png) | ![Firefox](https://cdn.jsdelivr.net/npm/@browser-logos/firefox/firefox_32x32.png) | ![Chrome](https://cdn.jsdelivr.net/npm/@browser-logos/chrome/chrome_32x32.png) | ![Safari](https://cdn.jsdelivr.net/npm/@browser-logos/safari/safari_32x32.png) |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Edge ≥ 79                                                              | Firefox ≥ 78                                                                      | Chrome ≥ 64                                                                    | Safari ≥ 12                                                                    |

## 安装

根据项目的lock文件选择对应的安装方式

::: code-group
```shell [pnpm]
pnpm i @sepveneto/basic-comp
```

```shell [yarn]
yarn add @sepveneto/basic-comp
```

```shell [npm]
npm i @sepveneto/basic-comp
```
:::

## 用法

### 全局引用

```js
import { createApp } from 'vue'
import basicComp from '@sepveneto/basic-comp'
import '@sepveneto/basic-comp/css'

createApp().use(BasicComp).mount('#app');
```

### 插件支持
可以在`tsconfig.json`中通过`compilerOptions.type`指定全局组件类型

```json
{
  "compilerOptions": {
    // ...
    "types": ["@sepveneto/basic-comp/global"]
  }
}
```
