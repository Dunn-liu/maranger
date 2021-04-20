<template>
<el-upload
    class="avatar-uploader"
    action="/api/upload/image"
    :show-file-list="false"
    :http-request="httpRequest"
>
<img v-if="src" :src="src" class="avatar">
<i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
</template>
<script>
import {defineComponent} from 'vue'
import {ElMessage} from 'element-plus'
import Compressor from 'compressorjs'
import {apiUploadImg} from '@/api/image'
export default defineComponent({
  emits:['getSrc'],
  props:['src'],
  setup(props,context){
    const httpRequest = (option) => {
      const file = option.file
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        ElMessage.warning({
          message: '上传图片只能是 JPG 或 png 格式!',
          type: 'warning'
        });
        return;
      }
      if (!isLt4M) {
        ElMessage.warning({
          message: '上传图片大小不能超过 4MB!',
          type: 'warning'
        });
        return;
      }
      new Compressor(file,{
        quality: 0.6,
        async success(result) {
          const formData = new FormData();
          formData.append('file', result, result.name);
          const res = await apiUploadImg(formData)
          context.emit('getSrc',res.src)
        },
        error(err) {
          console.log('err',err.message);
        },
      })
    }
    return{
      httpRequest
    }
  }
})
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
