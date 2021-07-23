<template>
  <el-button @click="dialogFormVisible=true" style="margin-bottom: 20px">添加文章分类</el-button>
  <el-table
      :data="classifyData"
      v-loading="loading"
      ref="classifyTableRef"
      border
      style="width: 100%"
      :default-sort = "{prop: 'id', order: 'descending'}"
  >
    <el-table-column
        prop="id"
        label="ID"
        width="100"
        sortable>
    </el-table-column>
    <el-table-column
        prop="classifyName"
        label="分类名"
        width="220">
    </el-table-column>
    <el-table-column
        prop="description"
        label="分类描述"
        width="600px"
    >
    </el-table-column>
    <el-table-column
            label="操作">
      <template v-slot="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="添加文章分类" v-model="dialogFormVisible">
    <el-form :model="form" ref="classifyRef" :rules="rules">
      <el-form-item label="分类名称" label-width="80" prop="classifyName">
        <el-input v-model="form.classifyName" maxlength="8" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="分类描述" label-width="80" prop="description">
        <el-input v-model="form.description" maxlength="20" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addClassify">确 定</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import {onMounted, reactive, ref, toRefs} from "vue";
import {apiGetClassify,apiAddClassify} from "@/api/article";
import {ElMessage} from "element-plus";

export default {
name: "ArticleClassify",
  setup(){
  const classifyRef = ref(null)
    const classifyTableRef = ref(null)
  const state = reactive({
    classifyData:[],
    loading:false,
    dialogFormVisible:false,
    form:{ // 添加文章分类表单
      classifyName:'',
      description:''
    },
    rules:{ // 表单验证规则
      'classifyName': [{required: true, message: '请输入分类名称!', trigger: 'blur'},]
    }
  })
    const getClassifyData = async ()=>{
      try{
        state.loading=true
        const res =await apiGetClassify()
        state.classifyData = res.data
      }catch (e){
        console.log(e)
      }
      state.loading=false
    }
    onMounted( async ()=>{
      await getClassifyData()
      classifyTableRef.value.doLayout() // 解决表格有时表头错位问题
    })
    const addClassify = ()=>{
      classifyRef.value.validate(async (valid)=>{
        if (valid){
          try{
            const res = await apiAddClassify(state.form)
            console.log(res)
            if(res.code === 200){
              ElMessage.success({
                message:res.msg,
                type:"success"
              })
              await getClassifyData()
            }else{
              ElMessage.error({
                message:'添加失败',
                type:"error"
              })
            }
            state.dialogFormVisible = false
          }catch (e){
            console.log(e)
          }
        }
      })
    }
    return {
    ...toRefs(state),
      classifyRef,
      classifyTableRef,
      addClassify
    }
  }
}
</script>

<style scoped>

</style>
