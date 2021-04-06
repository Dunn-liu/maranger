<template>
  <div class="add_article my_card">
    <ArticleForm :articleData="articleForm" @get-editor="getEditor" @get-valid="getFormValid" ref="articleFormRef"/>
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
import dayjs from 'dayjs'
import {apiPublishArticle} from "../../api/article";
import {useRouter} from "vue-router";
import ArticleForm from "@/components/ArticleForm.vue";
export default defineComponent({
name: "AddArticle",
  components:{ArticleForm},
  setup(props){
  const store = useStore()
  const router = useRouter()
  const articleFormRef = ref(null)
  let formValid = null
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
      })
    const getEditor=(e)=>{
      state.articleForm.article_content = e
    }
    const getFormValid= (e)=>{
      formValid = e
    }
    const publishArticle=async ()=>{ // 发布按钮
      articleFormRef.value.validateForm()
        if(!formValid){
          ElNotification({
            type:'error',
            message:'请检查表单内容!',
            duration:'2000'
          })
        }else{
          state.articleForm.post_date = dayjs(state.articleForm.post_date).format('YYYY-MM-DD HH:mm:ss')
          state.articleForm.classifyId  = state.articleForm.classifyId.join(',')
          const res =await apiPublishArticle(state.articleForm)
          if(res.code===200){
            ElNotification({
              type:'success',
              message:'发布成功!',
              duration:2000
            })
            router.push('/home/article/allArticle')
          }
        }
    }
    return {
      articleFormRef,
        ...toRefs(state),
      publishArticle,
      getEditor,
      getFormValid
    }
  }
})
</script>

<style scoped lang="scss">
  .add_article{
    flex-direction: column;
    align-items: center;
  }

</style>
