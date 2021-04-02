<template>
  <div class="add_article my_card">
    <el-form :model="articleForm" :rules="rules" ref="articleFormRef" label-width="80px" class="article_form" label-position="top">
      <div style="margin:15px 0">带 <span style="color: #F56C6C">*</span> 号的为必填项</div>
      <el-form-item label="文章标题" prop="article_title">
        <el-input v-model="articleForm.article_title"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="classifyId">
        <el-select v-model="articleForm.classifyId" placeholder="请选择" multiple collapse-tags>
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
        <el-input v-model="articleForm.author_nickname"></el-input>
      </el-form-item>
      <el-form-item label="内容摘要" prop="article_abstract">
        <el-input type="textarea" v-model="articleForm.article_abstract"></el-input>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="articleForm.article_keywords"></el-input>
      </el-form-item>
      <el-form-item label="发布时间" prop="post_date">
        <el-date-picker
            v-model="articleForm.post_date"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择发布时间"
            :shortcuts="shortcuts"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="sub_bths">
      <el-button type="success" @click="publishArticle">发布</el-button>
      <el-button type="info">存为草稿</el-button>
    </div>
  </div>
</template>

<script>
import {defineComponent,ref,reactive,toRefs,onMounted} from 'vue'
import {useStore} from "vuex";
import {ElNotification} from 'element-plus'
import E from 'wangeditor'
import hljs from 'highlight.js'
import {apiGetClassify} from "@/api/article";
import dayjs from 'dayjs'
import {apiPublishArticle} from "../../api/article";
import {useRouter} from "vue-router";
export default defineComponent({
name: "AddArticle",
  setup(props){
  const store = useStore()
    const router = useRouter()
  const articleFormRef = ref(null)
  const state = reactive({
        articleForm:{ // 文章表单数据
          article_title:'',
          article_content:'',
          author:store.state.userinfo.phone,
          author_nickname:store.state.userinfo.user_nickname||'',
          post_date:new Date(),
          article_abstract:'',
          article_keywords:'',
          classifyId:[]
        },
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
  }, // 表单校验规则,
      })
    const creatEditor = (domId)=>{ // 创建富文本编辑器
      const editor = new E(domId)
      editor.highlight = hljs
      Object.assign(editor.config,{
        height:300,
        zIndex:500,
        pasteFilterStyle:false,
        onchange(){
          state.articleForm.article_content=editor.txt.html()
        }
      })
      editor.create()
    }
    onMounted(async ()=>{
      // 初始化富文本编辑器
      creatEditor('#editor')
      // 获取文章分类
      const res = await apiGetClassify()
      state.classify = res.data
    })
    const publishArticle=()=>{ // 发布按钮
      state.articleForm.post_date = dayjs(state.articleForm.post_date).format('YYYY-MM-DD HH:mm:ss')
      console.log(state)
      articleFormRef.value.validate(async valid=>{
        if(!valid){
          ElNotification({
            type:'error',
            message:'请检查表单内容!',
            duration:'2000'
          })
        }else{
          // const newForm = JSON.parse(JSON.stringify(state.articleForm))
          state.articleForm.post_date = dayjs(state.articleForm.post_date).format('YYYY-MM-DD HH:mm:ss')
          state.articleForm.classifyId  = state.articleForm.classifyId.join(',')
          state.articleForm.article_content=state.articleForm.article_content.replace(/\"/g,"'")
          const res =await apiPublishArticle(state.articleForm)
          if(res.code===200){
            ElNotification({
              type:'success',
              message:'发布成功!',
              duration:'2000'
            })
            router.push('/home/article/allArticle')
          }
        }
      })
    }
    return {
      articleFormRef,
        ...toRefs(state),
      publishArticle
    }
  }
})
</script>

<style scoped lang="scss">
  .add_article{
    flex-direction: column;
    align-items: center;
    .article_form{
      width: 80%;
      .el-date-picker{
        z-index: 10000;
      }
    }
    .sub_bths {
      width: 20%;
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
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

</style>
