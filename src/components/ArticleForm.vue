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
    <el-form-item label="文章内容" prop="article_content">
      <div id="editor"></div>
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
import {defineComponent, onMounted,onBeforeUnmount, reactive, ref, toRefs} from 'vue'
import E from "wangeditor";
import hljs from "highlight.js";
import {apiGetClassify} from "../api/article";
export default defineComponent({
name: "ArticleForm",
  props:['articleData'],
  emits:['getEditor','getValid'],
  setup(props,context){
    const articleFormRef = ref(null)
    let editor = ref(null)
  const state = reactive({
    shortcuts: [{  // 时间选择器额外配置
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
     }],
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
    }
   })
    const creatEditor = (domId)=>{ // 创建富文本编辑器
      editor = new E(domId)
      editor.highlight = hljs
      Object.assign(editor.config,{
        height:300,
        zIndex:500,
        pasteFilterStyle:false,
        uploadImgServer:'/api/upload/image',
        uploadFileName:'file',
        placeholder:'',
        onchange(){
          context.emit("getEditor", editor.txt.html())
        },
        uploadImgHooks :{
          // 上传图片之前
          before: function(xhr) {
            console.log(xhr)

            // 可阻止图片上传
            // return {
            //   prevent: true,
            //   msg: '需要提示给用户的错误信息'
            // }
          },
          // 图片上传并返回了结果，图片插入已成功
          success: function(xhr) {
            console.log('success', xhr)
          },
          // 图片上传并返回了结果，但图片插入时出错了
          fail: function(xhr, editor, resData) {
            console.log('fail', resData)
          },
          // 上传图片出错，一般为 http 请求的错误
          error: function(xhr, editor, resData) {
            console.log('error', xhr, resData)
          },
          // 上传图片超时
          timeout: function(xhr) {
            console.log('timeout')
          },
          // 图片上传并返回了结果，想要自己把图片插入到编辑器中
          // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
          customInsert: function(insertImgFn, result) {
            // result 即服务端返回的接口
            // console.log('customInsert', result)
            // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
            insertImgFn(result.src)
          }
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
      // 获取文章分类
      const res = await apiGetClassify()
      state.classify = res.data
    });
    onBeforeUnmount(()=>{
      editor.destroy()
      editor=null
    })
    const validateForm=()=>{
      articleFormRef.value.validate(valid=>{
        context.emit('getValid',valid)
      })
    }
    return {
    props,
      articleFormRef,
      ...toRefs(state),
      validateForm
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
