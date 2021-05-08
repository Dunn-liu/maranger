<template>
  <el-form :model="articleData" :rules="rules" ref="articleFormRef" label-width="80px" class="article_form" label-position="top">
    <div style="margin:15px 0">带 <span style="color: #F56C6C">*</span> 号的为必填项</div>
    <el-form-item label="文章标题" prop="article_title">
      <el-input v-model="articleData.article_title"></el-input>
    </el-form-item>
    <el-form-item label="文章分类" prop="classifyId">
      <el-select v-model="articleData.classifyId" placeholder="请选择" multiple :collapse-tags="false">
        <el-option
            v-for="item in classify"
            :key="item.id"
            :label="item.classifyName"
            :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文章封面" prop="article_cover">
      <Upload @getSrc="getSrc" :src="articleData.article_cover"></Upload>
    </el-form-item>
    <el-form-item label="文章内容" prop="article_content">
        <div class="changeEditor">
          <span>切换编辑器</span><el-select v-model="editorType" @change="editorChange">
          <el-option :value="0" label="WangEditor"></el-option>
          <el-option :value="1" label="VMdEditor"></el-option>
        </el-select>
        </div>
      <WEditor v-if="isWangEditor" :article-data="articleData" @get-editor="getEditor" ref="WEditor" />
      <v-md-editor v-if="!isWangEditor" v-model="articleData.article_content" height="400px" ref="MdEditor"
                   left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save" :disabled-menus="[]" @upload-image="handleUploadImage"></v-md-editor>
    </el-form-item>
    <el-form-item label="作者" prop="author_nickname">
      <el-input v-model="articleData.author_nickname"></el-input>
    </el-form-item>
    <el-form-item label="内容摘要" prop="article_abstract">
      <el-input type="textarea" v-model="articleData.article_abstract"></el-input>
    </el-form-item>
    <el-form-item label="关键词">
      <el-input v-model="articleData.article_keywords"></el-input>
    </el-form-item>
    <el-form-item label="发布时间" prop="post_date">
      <el-date-picker
          v-model="articleData.post_date"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择发布时间"
          :shortcuts="shortcuts"
      >
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue'
import {apiGetClassify} from "../api/article";
import Upload from './Upload.vue'
import WEditor from './WEditor.vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import Compressor from "compressorjs";
import {apiUploadImg} from "../api/image";
export default defineComponent({
name: "ArticleForm",
  props:['articleData'],
  emits:['getValid','getEditorType','getUrl','getContent'],
  components: {Upload,WEditor},
  setup(props,context){
  const articleFormRef = ref(null)
  const WEditor = ref(null)
  const MdEditor = ref(null)
  const state = reactive({
    shortcuts: [ // 时间选择器额外配置
                {
                text: '今天',
                value: new Date(),
                }, {
                text: '昨天',
                value: (() => {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  return date
                })(),
                }, {
                text: '一周前',
                value: (() => {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  return date
                })(),
               }
              ],
     classify:'', // 文章分类数据
     rules: {
      'article_title': [{required: true, message: '请输入文章标题!', trigger: 'blur'},
        {min: 5,  message: '文章标题至少为5个字符', trigger: 'blur'}
      ],
      'article_content': [{required: true, message: '请输入文章内容!', trigger: 'blur'},
        {min: 20,  message: '文章内容至少为20个字符', trigger: 'blur'}
      ],
      'classifyId': [{type:'array',required: true, message: '请选择文章分类!', trigger: 'blur'},
      ],
      'author_nickname': [{required: true, message: '请输入作者', trigger: 'blur'},
      ],
      'article_abstract' :[{required:true,message: '请输入内容摘要', trigger: 'blur'},
        {min: 10,  message: '内容摘要至少为10个字符', trigger: 'blur'}
      ],
      'post_date': [{type:'date',required: true, message: '请输入作者', trigger: 'blur'},
      ],
    },
    editorType:props.articleData.editorType,
    isWangEditor:Number(props.articleData.editorType)===0?true:false
   })
    onMounted(async ()=>{
      // 获取文章分类
      const res = await apiGetClassify()
      state.classify = res.data
    });
    const editorChange = (val)=>{
      ElMessageBox.confirm(`切换编辑器后，保存内容将被清空，确定要切换吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        state.isWangEditor=!state.isWangEditor
        context.emit('getContent','')
      }).catch(()=>{
        if (val===0){
          state.editorType=1
        }else{
          state.editorType=0
        }
      })
      context.emit('getEditorType',state.editorType)
    }
     const validateForm=()=>{ // 表单验证
      articleFormRef.value.validate(valid=>{
        context.emit('getValid',valid)
      })
    }
    const getSrc = (e) =>{ // 获取图片上传src
      context.emit('getUrl',e)
    }
    const getEditor = (e)=>{
      context.emit('getContent',e)
    }
    const handleUploadImage = (event, insertImage, files)=>{
      new Compressor(files[0],{
        quality: 0.6,
        async success(result) {
          const formData = new FormData();
          formData.append('file', result, result.name);
          try{
            const res = await apiUploadImg(formData)
            insertImage({url:res.src})
          }catch (e) {
            ElMessage.error({
              message:e,
              type:'error',
              showClose:true
            })
          }
        },
        error(err) {
          console.log('err',err.message);
        },
      })
    }
    return {
      articleFormRef,
      WEditor,
      MdEditor,
      ...toRefs(state),
      validateForm,
      getSrc,
      getEditor,
      editorChange,
      handleUploadImage,
   }
  }
})
</script>

<style lang="scss">
.article_form{
  width: 80%;
  margin: 0 auto;
  .el-date-picker{
    z-index: 10000;
  }
  .changeEditor{
    margin-bottom: 10px;
    .el-select {
      margin:0 10px;
    }
  }
  /* table 样式 */
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }
  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }

  /* blockquote 样式 */
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  /* code 样式 */
  code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }

  /* ul ol 样式 */
  ul, ol {
    margin: 10px 0 10px 20px;
  }
}
.sub_bths {
  width: 20%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

</style>
