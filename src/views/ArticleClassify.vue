<template>
  <div>
    <el-button @click="showModal" style="margin: 20px 0">添加文章分类</el-button>
  <el-table
    :data="classifyData"
    v-loading="loading"
    ref="classifyTableRef"
    border
    style="width: 100%"
    :default-sort="{ prop: 'id', order: 'descending' }"
  >
    <el-table-column prop="id" label="ID" width="100" sortable>
    </el-table-column>
    <el-table-column prop="classifyName" label="分类名" width="220">
    </el-table-column>
    <el-table-column prop="description" label="分类描述" width="600px">
    </el-table-column>
    <el-table-column label="操作">
      <template v-slot="scope">
        <el-button
          type="primary"
          size="small"
          @click="editClassify(scope.row)"
        >编辑</el-button>
        <el-popconfirm title="确认删除吗？" @confirm="delClassify(scope.row)">
          <template #reference>
            <el-button
              type="danger"
              size="small"
            >删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    :title="type ? '编辑文章分类' : '添加文章分类'"
    v-model="dialogFormVisible"
  >
    <el-form :model="form" ref="classifyRef" :rules="rules">
      <el-form-item label="分类名称" label-width="80" prop="classifyName">
        <el-input
          v-model="form.classifyName"
          maxlength="8"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="分类描述" label-width="80" prop="description">
        <el-input
          v-model="form.description"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClassify">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs, watch } from "vue";
import {
  apiGetClassify,
  apiAddClassify,
  apiDelClassify,
  apiUpdataClassify,
} from "@/api/article";
// import { ElMessage } from "element-plus";

export default {
  name: "ArticleClassify",
  setup() {
    const classifyRef = ref(null);
    const classifyTableRef = ref(null);
    const type = ref(0);
    const state = reactive({
      classifyData: [],
      loading: false,
      dialogFormVisible: false,
      form: {
        // 添加文章分类表单
        classifyName: "",
        description: "",
      },
      rules: {
        // 表单验证规则
        classifyName: [
          { required: true, message: "请输入分类名称!", trigger: "blur" },
          { min: 3, max: 8, message: '分类名称最少3个字符', trigger: 'blur' },
        ],
      },
    });
    const getClassifyData = async () => {
      try {
        state.loading = true;
        const res = await apiGetClassify();
        state.classifyData = res.data;
      } catch (e) {
        console.log(e);
      }
      state.loading = false;
    };
    onMounted(async () => {
      await getClassifyData();
      classifyTableRef.value.doLayout(); // 解决表格有时表头错位问题
    });
    watch(
      () => state.dialogFormVisible,
      (curVal) => {
        if (!curVal) {
          state.form = {
            classifyName: "",
            description: "",
          };
          classifyRef.value.resetFields()
        }
      }
    );
    const addClassify = () => {
      classifyRef.value.validate(async (valid) => {
        if (valid) {
          if (state.classifyData.some(item=>item.classifyName === state.form.classifyName)) {
            ElMessage.info({
              message: '分类名称有重复，请检查！'
            });
            return
          }
          try {
            const res = type.value
              ? await apiUpdataClassify(state.form)
              : await apiAddClassify(state.form);
            if (res.code === 200) {
              ElMessage.success({
                message: res.msg,
                type: "success",
              });
              await getClassifyData();
              state.dialogFormVisible = false;
            } else {
              ElMessage.error({
                message: type.value?"更新失败":'添加失败',
                type: "error",
              });
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    };

    const editClassify = (record) => {
      type.value = 1;
      state.dialogFormVisible = true;
      const { classifyName, description, id } = record;
      state.form = {
        classifyName,
        description,
        id,
      };
    };

    const delClassify = async (record) => {
      const { id } = record;
      const res = await apiDelClassify(id);
      const { code, msg } = res;
      if (code === 200) {
        ElMessage.success({
          message: msg,
          type: "error",
        });
        await getClassifyData();
      }
    };
    const showModal = () => {
      if (state.classifyData.length && state.classifyData.length >= 10) {
        ElMessage.info({
          message: '分类最多添加10项，请检查！'
        });
        return
      }
      type.value = 0;
      state.dialogFormVisible = true;
    };
    return {
      ...toRefs(state),
      classifyRef,
      classifyTableRef,
      type,
      addClassify,
      editClassify,
      delClassify,
      showModal,
    };
  },
};
</script>

<style scoped>
</style>
