<template :key="index">
  <template v-if="item.children && item.children.length > 0">
    <el-sub-menu>
      <template #title>
        <iconpark-icon :name="item.icon" />&nbsp; &nbsp;
        <span>{{ item.title }}</span>
      </template>
      <el-menu-item-group v-for="(c, i) in item.children" :key="i">
        <MMenuItem :item="c"></MMenuItem>
      </el-menu-item-group>
    </el-sub-menu>
  </template>
  <template v-else>
    <el-menu-item :index="item.link || item.path">
      <iconpark-icon :name="item.icon" />&nbsp; &nbsp;
      <template #title>{{ item.title }}</template>
    </el-menu-item>
  </template>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "MMenuItem",
  props: ["isCollapse", "item", "index"],
  setup(props) {
    console.log('props',props)
    return {
      props,
    };
  },
});
</script>

<style scoped>
</style>
