<template>
  <div class="my_card all_article">
    <el-table
        :data="articleData"
        style="width: 100%"
        v-loading.fullscreen.lock="loading"
        border>
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          fixed
          prop="id"
          label="ID"
          width="100"
          >
      </el-table-column>
      <el-table-column
          prop="article_title"
          label="标题"
          show-overflow-tooltip
          >
      </el-table-column>
      <el-table-column
          prop="classifyId"
          label="分类"
      >
        <template v-slot="scope">
          <template v-for="item in scope.row.classifyId">
            {{ filterClassify(item).classifyName }}
            {{scope.row.classifyId.length>1?',':''}}
          </template>
        </template>
      </el-table-column>
      <el-table-column
          prop="author_nickname"
          label="作者"
          width="100"
          >
      </el-table-column>
      <el-table-column
          prop="post_date"
          label="发布时间"
          >
      </el-table-column>
      <el-table-column
          prop="edit_date"
          label="更新时间"
          >
      </el-table-column>
      <el-table-column
          prop="article_content"
          label="内容"
          show-overflow-tooltip
          >
      </el-table-column>
      <el-table-column
      prop="article_status"
      label="状态"
      width="100"
      >
        <template v-slot="scope">
          {{scope.row.article_status===1?'已发布':'草稿'}}
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
      >
        <template v-slot="scope">
          <el-button type="text" @click="editArticle(scope.row)">编辑</el-button>
          <el-button type="text">发布</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-drawer
      title="编辑文章"
      v-model="showDrawer"
      direction="rtl"
      destroy-on-close
      append-to-body
  >
    <ArticleForm :articleData="editData" @get-editor="getEditor" @get-valid="getFormValid" ref="articleFormRef"/>
    <div class="sub_bths">
      <el-button type="success" @click="saveEdit">保存</el-button>
      <el-button type="success" @click="cancelEdit">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import {defineComponent, onMounted, reactive, toRefs} from 'vue'
import {ElNotification} from 'element-plus'
import {apiGetArticle, apiGetClassify} from "../../api/article";
import ArticleForm from "@/components/ArticleForm.vue";
export default defineComponent({
  name: "AllArticle",
  components:{ArticleForm},
  setup(){
    let formValid =null
    const state = reactive({
      articleData:[], // 页面文章数据
      queryData:{
        keyword:'',
        classifyId:''
      },
      loading:false,
      showDrawer:false,
      editData: {}, //当前编辑文章数据
      classify:[], // 所有分类信息
    })
    onMounted(async ()=>{
      await getAllArticle()
       // 获取分类数据
      const classifyData = await apiGetClassify()
      state.classify = classifyData.data
    })
    // 获取文章信息
    const getAllArticle =async ()=>{
      state.loading=true
      // 获取所有文章信息
      const res = await apiGetArticle(state.queryData)
      if(res.code===200){
        state.loading=false
        res.data.forEach(item=>{
          item.classifyId = item.classifyId.split(",").map(c=>{
            c = Number(c)
            return c
          })
        })
        console.log(res.data)
        state.articleData = JSON.parse(JSON.stringify(res.data))
      }else {
        state.loading=false
        ElNotification({
          type:'error',
          message:'数据加载失败,请刷新页面!'
        })
      }
    }
    // 获取表单富文本编辑器内容
    const getEditor=(e)=>{
      state.editData.article_content = e
    }
    // 获取表单验证结果
    const getFormValid= (e)=>{
      formValid = e
    }
    // 打开编辑抽屉弹窗
    const editArticle = (row)=>{
      state.editData=JSON.parse(JSON.stringify(row))
      state.showDrawer=true
    }
    // 保存编辑
    const saveEdit = ()=>{
      console.log(state.editData)
    }
    // 取消编辑
    const cancelEdit = ()=>{
      state.showDrawer=false
    }
    // 根据分类id获取完成分类信息
    const filterClassify = (id)=>{
      if (state.classify.length===0) {
        return ''
      }else{
        return state.classify.filter(item=>{
          return item.id === id
        })[0]
      }
    }
    return {
      ...toRefs(state),
      editArticle,
      getEditor,
      getFormValid,
      saveEdit,
      cancelEdit,
      filterClassify
    }
  }
})
</script>

<style lang="scss">
.all_article{
}
.el-table--border, .el-table--group {
  border: none;
}
.el-table_body tr, .el-table_body td{
  height: 36px;
}
.el-drawer{
  width: 40% !important;
  overflow: auto;
  padding-bottom: 20px;
}
.sub_bths {
  width: 40%;
  margin: 0 auto;
}
</style>
