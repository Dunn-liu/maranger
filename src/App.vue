<template>
  <el-config-provider :locale="zhCn" size="large">
    <router-view />
  </el-config-provider>
</template>

<script lang='ts' setup>
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style lang="less">
.el-table--border th.gutter:last-of-type {
  display: block !important;
}
</style>
