<template :key="index">
  <template v-if="props?.item?.children && props?.item?.children.length > 0">
    <el-sub-menu>
      <template #title>
        <iconpark-icon :name="props?.item?.icon" />&nbsp; &nbsp;
        <span>{{ props?.item?.title }}</span>
      </template>
      <el-menu-item-group v-for="(c, i) in props?.item?.children" :key="i">
        <MMenuItem :item="c"></MMenuItem>
      </el-menu-item-group>
    </el-sub-menu>
  </template>
  <template v-else>
    <el-menu-item :index="props?.item?.link || props?.item?.path">
      <iconpark-icon :name="props?.item?.icon" />&nbsp; &nbsp;
      <template #title>{{ props?.item?.title }}</template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
const props = defineProps({
  isCollapse:Boolean,
  item:Object,
  index:Number
})
</script>

<style scoped>
</style>
