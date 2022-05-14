<template>
  <el-container style="height:100%">
    <SideBar />
    <el-container>
      <el-header class="m-header">
        <MenuFold />
        <div class="userinfo">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :src="$store.state.userinfo.avatar" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/personalSetting')">个人中心</el-dropdown-item>
                <el-dropdown-item @click="loginOut">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          &nbsp;欢迎您,&nbsp;{{ userStore.getUserInfo.user_nickname }}
        </div>
      </el-header>
      <el-main>
        <el-page-header style="
            border-bottom: 1px solid #ebeef5;
            padding-bottom: 10px;
            margin-bottom: 0;
          " icon="el-icon-arrow-left" @back="goBack" :content="$store.state.headerTitle"></el-page-header>
        <!-- <el-scrollbar> -->
        <router-view>
          <template #default="{ Component, route }">
            <transition name="fade-slide" mode="out-in" appear>
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </template>
        </router-view>
        <!-- </el-scrollbar> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import SideBar from './sideBar/index.vue'
import MenuFold from './MenuFold/MenuFold.vue'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app';
const router = useRouter();
const userStore = useUserStore()
const appStore = useAppStore()
const goBack = () => {
  router.go(-1);
};
const handleCollapse = () => {
  appStore.setCollapage()
}
const loginOut = () => {
  userStore.confirmLoginOut()
}
</script>
<style lang="scss" scoped>
.logo {
  padding: 10px 4px;
  height: 50px;
  display: flex;
  align-items: center;

  img {
    width: 32px;
    height: 32px;
    margin: 0 10px 0 12px;
  }

  .text {
    font-size: 16px;
    font-weight: 700;
    color: #fff
  }
}

.m-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 30px;
  background-color: #fff !important;
  border-bottom: 1px solid #eee;
  border-left: 1px solid #eee;

  .userinfo {
    display: flex;
    align-items: center;
    color: #000;
    font-size: 14px;
    letter-spacing: 3px;

    .el-avatar {
      margin-right: 10px;
    }
  }
}

:deep(.el-scrollbar) {
  height: calc(100% - 160px);
}

:deep(.el-aside) {
  width: auto !important;
  border-right: solid 1px #e6e6e6;
  background-color: #6e5374;
}

:deep(.el-menu-vertical-demo) {
  // height: calc(100vh - 60px);
  border: none;
  background-color: #6e5374;

  .el-menu--inline {
    background-color: #7d5e85;
  }

  .el-menu-item-group__title {
    padding: 0
  }
}

:deep(.el-menu-vertical-demo:not(.el-menu--collapse)) {
  width: 200px;
  min-height: 400px;
}
</style>
