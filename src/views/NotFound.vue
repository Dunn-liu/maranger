<template>
  <div class="not_found">
    <img src="../assets/img/404.gif" alt="404" />
    <h3>404 抱歉页面走丢了</h3>
    <el-button type="primary" size="medium" @click="$router.push('/home')">返回</el-button>
  </div>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "NotFound",
});
</script>

<style lang="less">
.not_found {
  width: 500px;
  margin: 80px auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
