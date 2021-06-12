import {ref} from 'vue'
import {ElMessage} from "element-plus";
import Compressor from "compressorjs";
import { apiUploadImg } from "../api/image";
export default function useImgRequest() {
    const resSrc = ref('')
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
                try {
                    const res = await apiUploadImg(formData)
                    resSrc.value = res.src
                    // context.emit('getSrc',res.src)
                    ElMessage({
                        type:'success',
                        message:'上传成功!',
                        showClose: true
                    })
                }catch (e){
                    console.log(e)
                }
            },
            error(err) {
                console.log('err',err.message);
            },
        })
    }
    return { httpRequest ,resSrc}
}