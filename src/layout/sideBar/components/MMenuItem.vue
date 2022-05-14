<template :key="index">
  <template v-if="menuSource.children && menuSource.children.length > 0">
    <el-sub-menu>
      <template #title>
        <svg-icon :name="menuSource.icon" />
        &nbsp; &nbsp;
        <span>{{ menuSource.title }}</span>
      </template>
      <el-menu-item-group v-for="(c, i) in menuSource.children" :key="i">
        <MMenuItem :item="c"></MMenuItem>
      </el-menu-item-group>
    </el-sub-menu>
  </template>
  <template v-else>
    <el-menu-item :index="menuSource.link || menuSource.path" @click="handleClick">
      <svg-icon :name="menuSource.icon" />
      &nbsp; &nbsp;
      <template #title>{{ menuSource.title }}</template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app';
import { computed } from 'vue';
const props = defineProps({
  item: Object,
  index: Number
})
const menuSource = computed(() => props.item || {})
const appStore = useAppStore()
const handleClick = () => {
  appStore.setMobileCollapage(false)
}
</script>

<style scoped>
</style>
