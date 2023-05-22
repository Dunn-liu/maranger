<template>
  <el-container>
    <el-aside>
      <Menu></Menu>
    </el-aside>
    <el-container>
      <el-header style="height: 100px;">
        <Header></Header>
        <Tabs></Tabs>
      </el-header>
      <el-main>
        <router-view v-slot="{ Component, route }">
          <transition appear name="fade-slide" mode="out-in">
            <keep-alive :include="keepAliveList">
              <component :is="Component" :key="route.fullPath"></component>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import Menu from "./Menu/index.vue";
import Header from "./Header/index.vue";
import Tabs from "./Tabs/index.vue";
import Footer from "./Footer/index.vue";
import { useUserStore } from '@/store/modules/user'
import { localGet } from "@/utils/local";
import { isEmpty, isNull } from "@/utils/is";
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const router = useRouter()
const keepAliveList: any = []
watch(() => router.currentRoute.value, (val) => {
  if (val.meta.keepAlive && keepAliveList.indexOf(val.name) === -1) {
    keepAliveList.push(val.name)
  }
  console.log('keepAliveList', keepAliveList);
}, { immediate: true, deep: true })
const getUserInfo = async () => {
  if (isNull(localGet('userInfo')) || isEmpty(localGet('userInfo'))) { await userStore.getUserInfoAction() }
}
getUserInfo()
</script>

<style lang="less">
@import "./index.less";
</style>
