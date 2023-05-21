<template>
  <div>
    <el-button @click="showModal" style="margin: 20px 0">添加文章分类</el-button>
    <Table :columns="columns" border :data="classifyData" :loading="loading"
      :default-sort="{ prop: 'id', order: 'descending' }">
      <template #action="scope">
        <el-button type="primary" size="small" @click="editClassify(scope.row)">编辑</el-button>
        <el-popconfirm title="确认删除吗？" @confirm="delClassify(scope.row)">
          <template #reference>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </Table>
    <Dialog :title="type ? '编辑文章分类' : '添加文章分类'" v-model="dialogFormVisible">
      <el-form :model="form" ref="classifyRef" :rules="rules">
        <el-form-item label="分类名称" label-width="80" prop="classifyName">
          <el-input v-model="form.classifyName" maxlength="10" show-word-limit></el-input>
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
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, unref, watch } from "vue";
import {
  apiGetClassify,
  apiAddClassify,
  apiDelClassify,
  apiUpdataClassify,
} from "@/api/article";
import { ElMessage } from "element-plus";
// import { ElMessage } from "element-plus";
import { TableColumn } from '@/types/table'
import type { FormInstance, FormRules } from 'element-plus'
interface ArticleClassifyItem {
  id: number;
  classifyName: string;
  description: string;
}
const columns: TableColumn[] = [
  {
    field: 'id',
    label: 'ID'
  },
  {
    field: 'classifyName',
    label: '分类'
  },
  {
    field: 'description',
    label: '分类描述'
  },
  {
    field: 'action',
    label: '操作'
  }
]
const classifyRef = ref<FormInstance>();
const type = ref(0);
const classifyData = ref<ArticleClassifyItem[]>([]);
const loading = ref(false);
const dialogFormVisible = ref(false);
interface IForm {
  classifyName: string
  description: string
  id?: number
}
const form = ref<IForm>({
  // 添加文章分类表单
  classifyName: "",
  description: "",
})
const rules = reactive<FormRules>({
  // 表单验证规则
  classifyName: [
    { required: true, message: "请输入分类名称!", trigger: "blur" },
    { min: 2, max: 10, message: '分类名称2-10个字符', trigger: 'blur' },
  ],
});
const getClassifyData = async () => {
  try {
    loading.value = true;
    const res = await apiGetClassify();
    classifyData.value = res.data;
  } catch (e) {
    console.log(e);
  }
  loading.value = false;
};
onMounted(async () => {
  await getClassifyData();
});
watch(
  () => dialogFormVisible,
  (curVal) => {
    if (!curVal) {
      form.value = {
        classifyName: "",
        description: "",
      };
      classifyRef?.value?.resetFields?.()
    }
  }
);
const addClassify = () => {
  classifyRef?.value?.validate(async (valid) => {
    if (valid) {
      if (!type.value && classifyData.value.some(item => item.classifyName === unref(form).classifyName)) {
        ElMessage.info({
          message: '分类名称有重复，请检查！'
        });
        return
      }
      try {
        const res = type.value
          ? await apiUpdataClassify(form.value)
          : await apiAddClassify(form.value);
        if (res.code === 200) {
          ElMessage.success({
            message: res.msg,
            type: "success",
          });
          await getClassifyData();
          dialogFormVisible.value = false;
        } else {
          ElMessage.error({
            message: type.value ? "更新失败" : '添加失败',
            type: "error",
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
};

const editClassify = (record: ArticleClassifyItem) => {
  type.value = 1;
  dialogFormVisible.value = true;
  form.value = { ...record };
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
  if (unref(classifyData).length && unref(classifyData).length >= 10) {
    ElMessage.info({
      message: '分类最多添加10项，请检查！'
    });
    return
  }
  type.value = 0;
  dialogFormVisible.value = true;
};

</script>

<style scoped></style>
