<template>
  <div class="m-header py-2">
    <MenuFold></MenuFold>
    <div class="ml-2">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="userinfo flex-1 justify-end mr-4">
      <Avatar></Avatar>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuFold from "./components/MenuFold.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import Avatar from "./components/Avatar.vue";
</script>

<style scoped lang="less">
@import "./index.less";
</style>
