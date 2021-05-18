<template>
  <div
      class="loading"
      v-loading="true"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.1)"
  >
  </div>
</template>

<script>
export default {
name: "Loading"
}
</script>

<style lang="scss">
.loading{
  width: 100%;
  height: 600px;
  margin-bottom: 20px;
}
</style>
