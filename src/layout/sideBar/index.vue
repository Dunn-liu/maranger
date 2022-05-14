<template>
  <el-aside v-if="!appStore.getMobile">
    <div class='py-2 px-1 h-12 flex items-center'>
      <img class=" w-8 h-8 mx-3" src="../../assets/img/logo_touming.png" />
      <transition name="fade-enter">
        <span class=' text-sm font-bold text-white' v-show="!appStore.isCollapse">Dunn Blog</span>
      </transition>
    </div>
    <el-menu class="el-menu-vertical-demo" :collapse="appStore.isCollapse" :router="true" :default-active="$route.path">
      <el-menu-item index="/home">
        <svg-icon name="calendar" />&nbsp;&nbsp;
        <template #title>日历</template>
      </el-menu-item>
      <template v-for="(item, index) in userStore.getRoleList" :key="item.id">
        <MMenuItem :item="item" :index="index" />
      </template>
    </el-menu>
  </el-aside>
  <div v-else class="menu-mobile">
    <el-drawer size="35" direction="ltr" :with-header="false" :show-close="false" @close="handleClose"
      :model-value="appStore.getMobileCollapse">
      <div class='py-2 px-1 h-12 flex items-center'>
        <img class=" w-8 h-8 mx-3" src="../../assets/img/logo_touming.png" />
        <transition name="fade-enter">
          <span class=' text-sm font-bold text-white' v-show="!appStore.isCollapse">Dunn Blog</span>
        </transition>
      </div>
      <el-menu class="el-menu-vertical-demo" :collapse="appStore.isCollapse" :router="true"
        :default-active="$route.path">
        <el-menu-item index="/home">
          <svg-icon name="calendar" />&nbsp;&nbsp;
          <template #title>日历</template>
        </el-menu-item>
        <template v-for="(item, index) in userStore.getRoleList" :key="item.id">
          <MMenuItem :item="item" :index="index" />
        </template>
      </el-menu>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user';
import { useAppStore } from '@/store/modules/app';
import MMenuItem from "./components/MMenuItem.vue";
const userStore = useUserStore()
const appStore = useAppStore()
const handleClose = () => {
  appStore.setMobileCollapage(false)
}
</script>
<style lang="scss" scoped>
.menu-mobile {
  :deep(.el-drawer__body) {
    padding: 0;
    background-color: #6e5374;
    overflow: hidden;
  }
}
</style>