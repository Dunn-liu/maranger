<template :key="index">
  <div v-if="item.children && item.children.length > 0">
    <el-submenu index="1">
      <template #title>
        <i :class="item.icon"></i>
        <span>{{ item.title }}</span>
      </template>
      <el-menu-item-group v-for="(c, i) in item.children" :key="i">
        <MenuItem :item="c"></MenuItem>
      </el-menu-item-group>
    </el-submenu>
  </div>
  <div v-else>
    <el-menu-item :index="item.link || item.path">
      <i :class="item.icon"></i>
      <template #title>{{ item.title }}</template>
    </el-menu-item>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Menu",
  props: ["isCollapse", "item", "index"],
  setup(props) {
    return {
      props,
    };
  },
});
</script>

<style scoped>
</style>
