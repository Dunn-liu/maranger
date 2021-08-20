<template>
  <el-button type="primary" v-for="item in btnList">{{ item }}</el-button>
</template>
<script>
import { ref, reactive, defineComponent, toRefs } from "vue";
export default defineComponent({
  name: "",
  props: {
    btnList: {
      type: Array,
      default: [1, 2],
    },
  },
  setup(props, context) {},
});
</script>
<style lang='scss'>
</style>