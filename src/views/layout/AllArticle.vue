<template>
  <div class="my_card">
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
        <el-button type="text">编辑</el-button>
        <el-button type="text">发布</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue'
import {ElNotification} from 'element-plus'
import {apiGetArticle} from "../../api/article";
export default defineComponent({
  name: "AllArticle",
  setup(){
    const state = reactive({
      articleData:[],
      queryData:{
        keyword:'',
        classifyId:''
      },
      loading:false
    })
    onMounted(async ()=>{
      state.loading=true
    const res = await apiGetArticle(state.queryData)
      if(res.code===200){
        state.loading=false
        state.articleData = res.data
      }else {
        state.loading=false
        ElNotification({
          type:'error',
          message:'数据加载失败,请刷新页面!'
        })
      }
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="scss">
.el-table--border, .el-table--group {
   border: none;
}
.el-table_body tr, .el-table_body td{
  height: 36px;
}

</style>
