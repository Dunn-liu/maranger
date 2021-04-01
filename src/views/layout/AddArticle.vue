<template>
  <div class="add_article my_card">
    <el-form :model="articleForm" :rules="rules" ref="articleFormRef" label-width="80px" class="article_form" label-position="top">
      <div style="margin-top: 15px">带 <span style="color: red">*</span> 号的为必填项</div>
      <el-form-item label="文章标题">
        <el-input v-model="articleForm.article_title"></el-input>
      </el-form-item>
      <el-form-item label="文章分类">
        <el-select v-model="articleForm" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章内容">
        <div id="editor"></div>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="articleForm.author_nickname"></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
            v-model="articleForm.post_date"
            type="datetime"
            placeholder="选择发布时间"
            align="right"
            :shortcuts="shortcuts"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {defineComponent,ref,reactive,toRefs,onMounted} from 'vue'
import {useStore} from "vuex";
import E from 'wangeditor'
import hljs from 'highlight.js'
export default defineComponent({
name: "AddArticle",
  setup(props){
  const store = useStore()
  const articleFormRef = ref(null)
  const state = reactive({
        articleForm:{
          article_title:'',
          article_content:'',
          author_nickname:store.state.userinfo.user_nickname||'',
          post_date:new Date(),
          source:'',
        },
        shortcuts: [{
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
        rules:[]
      })
    onMounted(()=>{
      const editor = new E('#editor')
      editor.highlight = hljs
      editor.config.height = 300
      editor.config.zIndex = 500
      editor.config.onchange=()=>{
        console.log(editor.txt.html())
      }
      editor.create()
    })
    return {
      articleFormRef,
        ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="scss">
  .add_article{
    .article_form{
      width: 80%;
      .el-date-picker{
        z-index: 10000;
      }
    }
  }

</style>
