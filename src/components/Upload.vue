<template>
  <div class="upload_com">
    <el-upload
      class="avatar-uploader"
      action="/api/upload/image"
      :drag="true"
      :show-file-list="false"
      :http-request="httpRequest"
    >
      <img v-if="src" :src="src" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-input v-model="input" placeholder="请输入图片描述"></el-input>
  </div>
</template>
<script>
import { defineComponent, watch } from "vue";
import useImgRequest from "../utils/imgHttpRequest";
export default defineComponent({
  emits: ["getSrc"],
  props: ["src"],
  setup(props, context) {
    const { httpRequest, resSrc } = useImgRequest();
    watch(resSrc, (newVal) => {
      context.emit("getSrc", newVal);
    });
    return {
      httpRequest,
    };
  },
});
</script>
<style lang='scss' scoped>
.upload_com {
  display: flex;
  flex-direction: column;
  align-items: center;
}
:deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
:deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
:deep .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
