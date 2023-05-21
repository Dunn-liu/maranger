<template>
  <div class="my_card">
    <div class="upload">
      <Upload @uploadSuc="uploadSuc" />
    </div>
    <Search ref="searchRef" @search="handleSearch" @reset="handleReset" :schema="schema" labe-width="70px" layout="inline"
      buttom-position="left" />
    <Table :columns="columns" border @sortChange="handlerSort" :data="imgData" :loading="loading" @init="initGetlist"
      :default-sort="{ prop: 'id', order: 'descending' }" :pagination="{
        total: totalNum
      }" v-model:currentPage="query.currentPage" v-model:pageSize="query.limit">
      <template #preview="{ row }">
        <el-image style="width: 200px; height: 100px" :src="row.src" :preview-teleported="true"
          :preview-src-list="[row.src]">
        </el-image>
      </template>
      <template #action="{ row }">
        <el-button size="small" type="primary" v-copy="row.src">复制链接</el-button>
        <el-popconfirm title="确认删除? 删除后不可恢复!" @confirm="delImage(row.id)">
          <template #reference>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import Upload from "@/components/Upload.vue";
import { apiGetImages, apiDelImage } from "@/api/image";
import dayjs from "dayjs";
import type { FormSchema } from '@/types/form'
import type { TableColumn } from "@/types/table";
import { ElMessage } from "element-plus";
interface ImageDataItem {
  id: number;
  type: number;
  update_time: string;
  src: string;
  name: string;
  describe: string;
}
const columns: TableColumn[] = [
  {
    field: 'id',
    label: 'ID',
    sortable: true
  },
  {
    field: 'name',
    label: '图片名'
  },
  {
    field: 'desc',
    label: '图片描述'
  },
  {
    field: 'src',
    label: '图片路径'
  },
  {
    field: 'update_time',
    label: '上传时间'
  },
  {
    field: 'preview',
    label: '预览',
    showOverflowTooltip: false,
    showWordLimit: false
  },
  {
    field: 'action',
    label: '操作'
  }
]
const imgData = ref<ImageDataItem[]>([])
const searchRef = ref()
const loading = ref(false)
const query = reactive({
  currentPage: 1,
  limit: 5,
  orderSort: {}
})
const totalNum = ref(0)
const schema = ref<FormSchema[]>([
  {
    field: 'id',
    label: "ID",
    component: 'Input'
  },
  {
    field: 'name',
    label: "图片名",
    component: 'Input',
  },
  {
    field: 'update_time',
    label: "上传时间",
    component: 'DatePicker',
    componentProps: { 'value-format': 'YYYY-MM-DD' }
  }
])
const handleSearch = async (model: any) => {
  await fetchImages(model);
}
const handleReset = async (model: any) => {
  await fetchImages(model);
}
const fetchImages = async (model: Record<string, any>) => {
  loading.value = true;
  const res = await apiGetImages({ ...model, ...query });
  res.data.forEach((item) => {
    item.update_time = dayjs(item.update_time).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  });
  imgData.value = [...res.data];
  loading.value = false;
  totalNum.value = res?.pageNation?.total;
};
onMounted(async () => {
  initGetlist()
});
const initGetlist = async () => {
  const model = await searchRef?.value?.getModel?.()
  await fetchImages(model);
}
const handlerSort = async ({ prop, order }) => {
  if (prop) {
    query.orderSort = {};
    query.orderSort[prop] = order === "ascending" ? "asc" : "desc";
    await initGetlist()
  }
};
// 分页功能方法
const uploadSuc = async () => {
  await initGetlist()
};
const delImage = async (id) => {
  const res = await apiDelImage(id);
  if (res && res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功!",
      showClose: true,
    });
    imgData.value = imgData.value.filter(item => item.id !== id)
  }
};
</script>
