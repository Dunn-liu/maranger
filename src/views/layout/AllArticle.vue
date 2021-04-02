<template>
  <div class="my_card">
    <el-table
        :data="articleData"
        style="width: 100%"
        border>
      <el-table-column
          fixed
          prop="id"
          label="ID"
          >
      </el-table-column>
      <el-table-column
          prop="article_title"
          label="标题"
          >
      </el-table-column>
      <el-table-column
          prop="author_nickname"
          label="作者"
          >
      </el-table-column>
      <el-table-column
          prop="post_date"
          label="发布日期"
          >
      </el-table-column>
      <el-table-column
          prop="edit_date"
          label="编辑日期"
          >
      </el-table-column>
      <el-table-column
          prop="article_content"
          label="内容"
          show-overflow-tooltip
          >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue'
import {apiGetArticle} from "../../api/article";
export default defineComponent({
  name: "AllArticle",
  setup(){
    const state = reactive({
      articleData:[],
      queryData:{
        keyword:'',
        classifyId:''
      }
    })
    onMounted(async ()=>{
    const res = await apiGetArticle(state.queryData)
      state.articleData = res.data
      console.log(res)
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="scss">
.el-table_body tr, .el-table_body td{
  height: 36px;
}

</style>
