<template>
      <el-aside>
        <div class='py-2 px-1 h-12 flex items-center'>
          <img
            class=" w-8 h-8 mx-3"
            src="../../assets/img/logo_touming.png"
          />
          <transition name="fade-enter">
            <span class=' text-sm font-bold text-white' v-show="!isCollapse">Dunn Blog</span>
          </transition>
        </div>
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :router="true"
          :default-active="$route.path"
        >
          <el-menu-item index="/home">
            <iconpark-icon name="calendar" /> &nbsp;&nbsp;
            <template #title>日历</template>
          </el-menu-item>
          <template
            v-for="(item, index) in routeList"
            :key="item.id"
          >
            <MMenuItem :isCollapse="isCollapse" :item="item" :index="index" />
          </template>
        </el-menu>
      </el-aside>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user';
import { computed, ref } from 'vue'
import MMenuItem from "./components/MMenuItem.vue";
const isCollapse = ref(false);
const userStore = useUserStore()
  console.log('userStore.getRoleList',userStore)
const routeList = computed(()=>{
  return userStore.getRoleList
})
console.log('1231',routeList)
</script>