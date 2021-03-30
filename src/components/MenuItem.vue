<template :key="index">
   <template v-if="item.children&&item.children.length>0">
    <el-submenu>
      <template #title>
        <i :class="item.meta.icon"></i>
        <span>{{item.meta.title}}</span>
      </template>
      <el-menu-item-group v-for="(c,i) in item.children" >
        <MenuItem :item="c" :key="i"></MenuItem>
      </el-menu-item-group>
    </el-submenu>
  </template>
  <template v-else>
    <el-menu-item :index="item.meta.link||item.path">
        <i :class="item.meta.icon"></i>
        <span slot="title">{{item.meta.title}}</span>
    </el-menu-item>
  </template>
</template>

<script>
import {defineComponent} from 'vue'
export default defineComponent({
  name: "Menu",
  props:['isCollapse',"item","index"],
  setup(props){
    return {
      props
    }
  }
})
</script>

<style scoped>
</style>
