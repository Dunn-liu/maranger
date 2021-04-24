<template>
    <div id="editor" v-loading="isLoadImg" element-loading-text="图片上传中" element-loading-spinner="el-icon-loading"></div>
</template>

<script>
    import E from "wangeditor";
    import hljs from "highlight.js";
    import {ElMessage} from "element-plus";
    import Compressor from "compressorjs";
    import {apiUploadImg} from "../api/image";
    import {onBeforeUnmount, onMounted, ref,reactive} from "vue";
    import {useStore} from 'vuex'
    export default {
        name: "WEditor",
        props:['articleData'],
        emits:['getEditor'],
        setup(props,content){
            let editor = ref(null)
            const isLoadImg = ref(false)
            const creatEditor = (domId)=>{ // 创建富文本编辑器
                editor = new E(domId)
                editor.highlight = hljs
                Object.assign(editor.config,{
                    height:300,
                    zIndex:500,
                    pasteFilterStyle:false,
                    uploadImgTimeout:20*1000,
                    uploadImgMaxSize : 2 * 1024 * 1024,
                    uploadFileName:'file',
                    placeholder:'',
                    onchange(){
                        content.emit('getEditor',editor.txt.html())
                    },
                    customAlert:function (info){
                        ElMessage.error({
                            message:info,
                            type:'error',
                            showClose:true
                        })
                    },
                    customUploadImg :function (files, insert) {
                        new Compressor(files[0],{
                            quality: 0.6,
                            async success(result) {
                                const formData = new FormData();
                                formData.append('file', result, result.name);
                                try{
                                    isLoadImg.value=true
                                    const res = await apiUploadImg(formData)
                                    insert(res.src)
                                }catch (e) {
                                    ElMessage.error({
                                        message:e,
                                        type:'error',
                                        showClose:true
                                    })
                                }
                                isLoadImg.value=false
                            },
                            error(err) {
                                console.log('err',err.message);
                            },
                        })
                    }
                })
                editor.create()
                if(props.articleData.article_content){
                    editor.txt.html(props.articleData.article_content)
                }
            }
            onMounted(async ()=>{
                // 初始化富文本编辑器
                creatEditor('#editor')
            });
            onBeforeUnmount(()=>{ // 销毁富文本编辑器
                editor.destroy()
                editor=null
            })
            return{
                isLoadImg
            }
        }
    }
</script>

<style scoped>

</style>