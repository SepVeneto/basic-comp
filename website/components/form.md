---
title: Form
---
# 表单

对`element-plus`的表单进行增强

## required

:::tip
`bc-form`不是必须的，可以正常使用`el-form`
:::

`element-plus`中虽然有`required`属性，但是由于默认行为是进行`${prop} is required`的组合，所以明明是一个很方便的属性，但是完全没有使用场景。因此重写了这个属性，默认进行`${label || prop}是必填项`的组合, 同时支持自定义内容。

:::demo

form/basic

:::

## FormItem 属性
| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| :---- | :--- | :---- | :----- | :------ |
| required | 是否必填 | boolean | - | false |