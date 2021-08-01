<template>
  <el-button type="primary" plain @click="openUpload">上传</el-button>
  <el-dialog title="上传图片" v-model="dialogVisible" width="30%">
    <div class="dialog_content">
      <div class="upload_com">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          action=""
          :on-change="fileChange"
          :drag="true"
          :multiple="false"
          :file-list="fileList"
          :show-file-list="false"
          :auto-upload="false"
          :http-request="httpRequest"
          :data="imgDesc"
        >
          <img v-if="localSrc" :src="localSrc" class="avatar" />
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-input
          style="width: 240px; margin-top: 15px"
          v-model.trim="imgDesc.desc"
          placeholder="请输入图片描述"
        ></el-input>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitUpload">上传</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { defineComponent, watch, ref, reactive, toRefs } from "vue";
import { ElMessage } from "element-plus";
import useImgRequest from "../utils/imgHttpRequest";
export default defineComponent({
  emits: ["uploadSuc"],
  setup(props, context) {
    const { httpRequest, resSrc } = useImgRequest();
    const uploadRef = ref(null);
    const state = reactive({
      fileList: [],
      imgDesc: { desc: "" },
      localSrc: "",
      dialogVisible: false,
    });
    watch(resSrc, (newVal) => {
      context.emit("uploadSuc", newVal);
    });
    const openUpload = () => {
      state.localSrc = "";
      state.imgDesc.desc = "";
      state.dialogVisible = true;
    };
    const fileChange = (file) => {
      const isJPG =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";
      const isLt4M = file.raw.size / 1024 / 1024 < 4;

      if (!isJPG) {
        ElMessage.warning({
          message: "上传图片只能是 JPG 或 png 格式!",
          type: "warning",
        });
        return;
      }
      if (!isLt4M) {
        ElMessage.warning({
          message: "上传图片大小不能超过 4MB!",
          type: "warning",
        });
        return;
      }
      if (isJPG && isLt4M) {
        state.localSrc = URL.createObjectURL(file.raw);
      }
    };
    const submitUpload = async () => {
      if (!state.localSrc) {
        ElMessage.warning({
          message: "请先选择上传图片！",
          type: "warning",
        });
        return;
      }
      if (!state.imgDesc.desc) {
        ElMessage.warning({
          message: "请输入图片描述！",
          type: "warning",
        });
        return;
      }
      uploadRef.value.submit();
      state.fileList = [];
      state.dialogVisible = false;
    };
    return {
      httpRequest,
      uploadRef,
      openUpload,
      resSrc,
      ...toRefs(state),
      fileChange,
      submitUpload,
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
:deep(.avatar-uploader .el-upload:hover) {
  border-color: #409eff;
}
:deep(.el-upload-dragger) {
  width: 240px;
  height: 178px;
}
.avatar {
  width: 240px;
  height: 178px;
  display: block;
}
</style>
