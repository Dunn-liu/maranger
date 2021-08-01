import { ref } from 'vue'
import { ElMessage } from "element-plus";
import Compressor from "compressorjs";
import { apiUploadImg } from "../api/image";
export default function useImgRequest() {
    const resSrc = ref('')
    const httpRequest = (option) => {
        const file = option.file
        new Compressor(file, {
            quality: 0.6,
            async success(result) {
                const formData = new FormData();
                console.log("option.data.desc", option.data.desc);
                formData.append('file', result, result.name);
                formData.append('desc', option.data.desc)
                try {
                    const res = await apiUploadImg(formData)
                    if (res.code === 200) {
                        resSrc.value = res.src
                        ElMessage({
                            type: 'success',
                            message: '上传成功!',
                            showClose: true
                        })
                    } else {
                        ElMessage({
                            type: 'error',
                            message: res.msg,
                            showClose: true
                        })
                    }
                } catch (e) {
                    console.log(e)
                }
            },
            error(err) {
                console.log('err', err.message);
            },
        })
    }
    return { httpRequest, resSrc }
}