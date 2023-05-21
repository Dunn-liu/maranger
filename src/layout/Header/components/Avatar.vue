<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar :src="userInfo.avatar" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="$router.push('/personalSetting')">个人中心</el-dropdown-item>
        <el-dropdown-item @click="loginOut">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  &nbsp;欢迎您,&nbsp;{{ userInfo.user_nickname }}
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const userInfo = computed(() => userStore.getUserInfo || {})
const loginOut = () => {
  userStore.confirmLoginOut()
}
</script>

<style scoped lang="less">
@import "../index.less";
</style>
