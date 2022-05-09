<template>
  <el-config-provider :locale="zhCn" size="large">
    <router-view />
  </el-config-provider>
</template>

<script lang='ts' setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style lang="scss">
.el-table--border th.gutter:last-of-type {
  display: block !important;
}

.my_card {
  display: flex;
  // justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 4px;
  min-height: 600px;
  // border: 1px solid #EBEEF5;
  background-color: #fff;

  .search_bar {
    display: flex;

    .el-form-item {
      margin-right: 40px;
    }

    .el-input {
      width: 160px;
    }
  }

  .page_nation {
    margin: 20px auto 10px;
  }
}
</style>
