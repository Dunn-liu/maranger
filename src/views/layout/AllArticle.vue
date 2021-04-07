<template>
  <div class="my_card all_article">
    <el-form class="search_bar" label-width="70px" label-position="left">
      <el-form-item label="关键词">
        <el-input v-model="queryData.keyword"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="queryData.classifyId" placeholder="请选择" collapse-tags clearable>
          <el-option
              v-for="item in classify"
              :key="item.id"
              :label="item.classifyName"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章状态">
        <el-select placeholder="请选择" collapse-tags v-model="queryData.articleStatus" clearable>
          <el-option label="已发布" :value="1" :key="1">
          </el-option>
          <el-option label="未发布" :value="0" :key="0">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" @click="getArticle">查询</el-button>
        <el-button @click="clearQuery">清除</el-button>
        <el-button type="danger" @click="delArticle">删除文章</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="articleData"
        style="width: 100%"
        v-loading.fullscreen.lock="loading"
        @selection-change="handleSelectionChange"
        ref="tableRef"
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
          <template v-for="(item,index) in scope.row.classifyId">
            {{ filterClassify(item).classifyName }}
            {{scope.row.classifyId.length===index+1?'':','}}
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
    <div class="page_nation">
      <el-pagination
          background
          layout="prev, pager, next ,sizes "
          :page-sizes="[10, 20]"
          :page-size="queryData.limit"
          :current-page="queryData.page"
          :total="totalNum"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
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
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue'
import {ElAlert, ElMessage, ElMessageBox, ElNotification} from 'element-plus'
import {apiDelArticle, apiGetArticle, apiGetClassify, apiUpdateArticle} from "../../api/article";
import ArticleForm from "@/components/ArticleForm.vue";
import dayjs from "dayjs";
export default defineComponent({
  name: "AllArticle",
  components:{ArticleForm},
  setup(){
    let formValid =null
    const articleFormRef = ref(null)
    const tableRef = ref(null)
    const state = reactive({
      articleData:[], // 页面文章数据
      queryData:{
        keyword:'',
        classifyId:'',
        articleStatus:'',
        page:1,
        limit:10
      },
      loading:false,
      showDrawer:false,
      editData: {}, //当前编辑文章数据
      classify:[], // 所有分类信息
      multipleSelection:[], // 选中的文章id
      delSelect:'',
      totalNum:50
    })
    onMounted(async ()=>{
      await getArticle()
       // 获取分类数据
      const classifyData = await apiGetClassify()
      state.classify = classifyData.data
    })
    // 获取文章信息
    const getArticle =async ()=>{
      state.loading=true
      // 获取所有文章信息
      const res = await apiGetArticle(state.queryData)
      if(res.code===200){
        state.loading=false
        res.data.forEach(item=>{
          item.edit_date = dayjs( item.edit_date).format('YYYY-MM-DD HH:mm:ss')
          item.classifyId = item.classifyId.split(",").map(c=>{
            c = Number(c)
            return c
          })
        })
        state.totalNum = res.pageNation.total
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
    const saveEdit = async ()=>{
      articleFormRef.value.validateForm()
      if(!formValid){
        ElNotification({
          type:'error',
          message:'请检查表单内容!',
          duration:2000
        })
      }else {
        state.editData.post_date = dayjs(state.editData.post_date).format('YYYY-MM-DD HH:mm:ss')
        state.editData.classifyId  = state.editData.classifyId.join(',')
        const res = await apiUpdateArticle(state.editData)
        if (res.code === 200) {
          ElNotification({
            type:'success',
            message:'文章更新成功!',
            duration:2000
          })
          await getArticle()
          state.showDrawer=false
        }
      }
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
    // 清空搜索表单
    const clearQuery = ()=>{
      state.queryData={
        keyword:'',
        classifyId:'',
        articleStatus:''
      }
    }
    // 选择文章
    const handleSelectionChange = (val)=>{
      state.multipleSelection = val
      state.delSelect = state.multipleSelection.map(item=>{
        return item.id
      }).join(',')
    }
    const delArticle = async () =>{
      if (!state.delSelect) {
        ElMessage.warning({
          showClose: true,
          duration:1500,
          message: '请先选中需要操作的文章!',
          type: 'warning'
        });
      }else{
        ElMessageBox.confirm(
          '此操作不可恢复, 是否继续删除文章?', '提示', {
          confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
        }).then(async () => {
          const res =await  apiDelArticle({id:state.delSelect})
          if(res.code===200){
            ElMessage.warning({
              showClose: true,
              duration:1500,
              message: '删除成功!',
              type: 'success'
            });
            await getArticle()
          }
        }).catch(() => {
          tableRef.value.clearSelection();
          ElNotification({
            type:'info',
            message:'取消操作!',
            duration:1500
          })
        });
      }
    }
    // 分页功能方法
    const handleCurrentChange = async (val)=>{
      state.queryData.page = val
      await getArticle()
    }
    const handleSizeChange = async (val) =>{
      state.queryData.page = 1
      state.queryData.limit = val
      await getArticle()
    }
    return {
      articleFormRef,
      tableRef,
      ...toRefs(state),
      editArticle,
      getEditor,
      getFormValid,
      saveEdit,
      cancelEdit,
      filterClassify,
      getArticle,
      clearQuery,
      handleSelectionChange,
      delArticle,
      handleCurrentChange,
      handleSizeChange
    }
  }
})
</script>

<style lang="scss">
.all_article{
  flex-direction: column;
  .search_bar {
    display: flex;
    .el-form-item {
      margin-right: 40px;
    }
    .el-input {
      width: 160px;
    }
  }
  .page_nation {
    margin: 20px auto 10px;
  }
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
