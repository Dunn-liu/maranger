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
import {defineComponent,watch} from 'vue'
import useImgRequest  from '../utils/imgHttpRequest'
export default defineComponent({
  emits:['getSrc'],
  props:['src'],
  setup(props,context){
    const { httpRequest , resSrc} = useImgRequest()
      watch(resSrc,(newVal)=>{
          context.emit('getSrc',newVal)
          console.log('resSrc.value',newVal)
      })
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
