<template>
  <div class="menu" :style="{ width: isCollapse ? '65px' : '220px' }">
    <Logo :isCollapse="isCollapse"></Logo>
    <el-scrollbar>
      <el-menu :default-active="activeMenu" :router="true" :collapse="isCollapse" :collapse-transition="false"
        :unique-opened="true" background-color="#001529" text-color="#bdbdc0" active-text-color="#fff">
        <el-menu-item index="/home">
          <svg-icon name="calendar" />&nbsp;&nbsp;
          <template #title>日历</template>
        </el-menu-item>
        <SubItem :menuList="menuList"></SubItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { MenuStore } from "@/store/modules/menu";
import { useUserStore } from '@/store/modules/user';
import Logo from "./components/Logo.vue";
import SubItem from "./components/SubItem.vue";

const route = useRoute();
const userStore = useUserStore()
const menuStore = MenuStore();

const activeMenu = computed((): string => route.path);
const isCollapse = computed((): boolean => menuStore.isCollapse);
const menuList = computed((): Menu.MenuOptions[] => userStore.getRoleList);

// aside 自适应
const screenWidth = ref<number>(0);
const screenHeight = ref<number>(0);
//监听窗口大小
const listeningWindow = () => {
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
      screenHeight.value = document.body.clientHeight;
      if (isCollapse.value === false && screenWidth.value < 1200) menuStore.setCollapse();
      if (isCollapse.value === true && screenWidth.value > 1200) menuStore.setCollapse();
    })();
  };
};
listeningWindow();
</script>

<style scoped lang="less">
@import "./index.less";
</style>
