<script lang="ts" setup name="AllArticle">
import { defineAsyncComponent, onMounted, ref } from "vue";
import {
  apiDelArticle,
  apiGetArticle,
  apiGetClassify,
  apiUpdateArticle,
  apiChangeStatus
} from "../api/article";
import dayjs from "dayjs";
import type { ElTable, FormInstance } from 'element-plus'
import ComponentLoading from "@/components/ComponentLoading.vue";
const ArticleForm = defineAsyncComponent({
  loader: () => import("@/components/FormArticle"),
  loadingComponent: ComponentLoading,
});
const articleFormRef = ref<FormInstance | any>();
const tableRef = ref<InstanceType<typeof ElTable>>();
const previewVisible = ref(false)
const previewContent = ref('')
const articleData = ref([])
const queryData = ref({
  keyword: "",
  classifyId: "",
  articleStatus: "",
  page: 1,
  limit: 10,
  orderSort: {},
})
const queryLoading = ref(false)
const showDrawer = ref(false)
const editData = ref<ArticleData>({
  // 文章表单数据
  article_title: "",
  article_content: "",
  article_cover: "",
  author: "",
  author_nickname: "",
  post_date: new Date(),
  edit_date: new Date(),
  article_abstract: "",
  article_keywords: "",
  article_status: 1,
  classifyId: [],
  editorType: 1,
})
const classify = ref<ClassifyType[]>([])
const multipleSelection = ref([])
const delSelect = ref('')
const totalNum = ref(0)
onMounted(async () => {
  await getArticle();
  // 获取分类数据
  const classifyData = await apiGetClassify();
  classify.value = classifyData.data;
  tableRef.value?.doLayout(); // 解决表格有时表头错位问题
});
// 获取文章信息
const getArticle = async () => {
  queryLoading.value = true;
  // 获取所有文章信息
  const res = await apiGetArticle(queryData.value);
  if (res.code === 200) {
    res.data.forEach((item) => {
      item.edit_date = dayjs(item.edit_date).format("YYYY-MM-DD HH:mm:ss");
      item.post_date = dayjs(item.post_date).format("YYYY-MM-DD HH:mm:ss");
      item.classifyId = item.classifyId.split(",").map((c) => {
        c = Number(c);
        return c;
      });
    });
    totalNum.value = res.pageNation.total;
    articleData.value = JSON.parse(JSON.stringify(res.data));
    queryLoading.value = false;
  } else {
    queryLoading.value = false;
    // @ts-ignore
    ElNotification({
      type: "error",
      message: "数据加载失败,请刷新页面!",
    });
  }
};
// 打开编辑抽屉弹窗
const editArticle = (row: ArticleData) => {
  editData.value = row;
  showDrawer.value = true;
};
// 保存编辑
const saveEdit = async () => {
  const formValid = await articleFormRef?.value?.validateForm(); // 调用子组件方法
  if (formValid) {
    const newEditData = JSON.parse(JSON.stringify(editData.value));
    (newEditData.post_date = dayjs(newEditData.post_date).format(
      "YYYY-MM-DD HH:mm:ss"
    )),
      (newEditData.classifyId = newEditData.classifyId.join(","));
    const res = await apiUpdateArticle(newEditData);
    if (res.code === 200) {
      // @ts-ignore
      ElNotification({
        type: "success",
        message: "文章更新成功!",
        duration: 2000,
      });
      await getArticle();
      showDrawer.value = false;
    }
  }
};
// 取消编辑
const cancelEdit = () => {
  showDrawer.value = false;
};
// 根据分类id获取完成分类信息
const filterClassify = (id) => {
  if (classify.value.length === 0) {
    return "";
  } else {
    const value = classify.value.filter((item) => {
      return item.id === id;
    })[0];
    return value.classifyName
  }
};
// 清空搜索表单
const clearQuery = async () => {
  queryData.value = {
    ...queryData.value,
    keyword: "",
    classifyId: "",
    articleStatus: "",
  };
  await getArticle();
};
// 选择文章
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
  delSelect.value = multipleSelection.value
    .map((item: any) => {
      return item.id;
    })
    .join(",");
};
const delArticle = async () => {
  if (!delSelect.value) {
    // @ts-ignore
    ElMessage.warning({
      showClose: true,
      duration: 1500,
      message: "请先选中需要操作的文章!",
      type: "warning",
    });
  } else {
    // @ts-ignore
    ElMessageBox.confirm("此操作不可恢复, 是否继续删除文章?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      // type: "warning"
    })
      .then(async () => {
        const res = await apiDelArticle({ id: delSelect.value });
        if (res.code === 200) {
          // @ts-ignore
          ElMessage({
            showClose: true,
            duration: 1500,
            message: "删除成功!",
            type: "success",
          });
          await getArticle();
        }
      })
      .catch(() => {
        tableRef?.value?.clearSelection();
        // @ts-ignore
        ElNotification({
          type: "info",
          message: "取消操作!",
          duration: 1500,
        });
      });
  }
};
// 分页功能方法
const handleCurrentChange = async (val) => {
  queryData.value.page = val;
  await getArticle();
};
const handleSizeChange = async (val) => {
  queryData.value.page = 1;
  queryData.value.limit = val;
  await getArticle();
};
const handlerSort = async ({ prop, order }) => {
  if (prop) {
    queryData.value.orderSort = {};
    queryData.value.orderSort[prop] =
      order === "ascending" ? "asc" : "desc";
    await getArticle();
  }
};
const changeStatus = async (row, type) => {
  const data = {
    id: row.id,
    article_status: +type,
  };
  const res = await apiChangeStatus(data);
  if (res.code === 200) {
    // @ts-ignore
    ElMessage({
      type: +type === 0 ? "warning" : "success",
      showClose: true,
      duration: 1500,
      message: +type === 0 ? "文章下架成功!" : "文章发布成功!",
    });
    articleData.value.forEach((item: any) => {
      if (item.id === row.id) {
        item.article_status = item.article_status === 0 ? 1 : 0
      }
    });
  }
};
// 预览
const previewArticle = (content) => {
  previewVisible.value = true
  previewContent.value = content
}
const setVisible = () => {
  previewVisible.value = false
}
</script>

<template>
  <div class="my_card all_article">
    <!-- <el-affix > -->
    <el-form class="search_bar flex flex-wrap" label-width="70px" label-position="left">
      <el-form-item label="关键词">
        <el-input v-model="queryData.keyword"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="queryData.classifyId" placeholder="请选择" collapse-tags clearable>
          <el-option v-for="item in classify" :key="item.id" :label="item.classifyName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章状态">
        <el-select placeholder="请选择" collapse-tags v-model="queryData.articleStatus" clearable>
          <el-option label="已发布" :value="1" :key="1"> </el-option>
          <el-option label="未发布" :value="0" :key="0"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" @click="getArticle" :loading="queryLoading">查询</el-button>
        <el-button @click="clearQuery">重置</el-button>
        <el-button type="danger" @click="delArticle">删除文章</el-button>
      </el-form-item>
    </el-form>
    <!-- </el-affix> -->
    <el-table :data="articleData" style="width: 100%" max-height="650" v-loading="queryLoading"
      element-loading-text="拼命加载中" @selection-change="handleSelectionChange" ref="tableRef"
      :default-sort="{ prop: 'id', order: 'descending' }" @sort-change="handlerSort" border>
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column fixed prop="id" label="ID" width="90" sortable="custom">
      </el-table-column>
      <el-table-column prop="article_title" label="标题" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="classifyId" label="分类" width="200">
        <template v-slot="scope">
          <template v-for="(item, index) in scope.row.classifyId">
            {{ filterClassify(item) }}
            {{ scope.row.classifyId.length === index + 1 ? "" : "," }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="author_nickname" label="作者" width="150">
      </el-table-column>
      <el-table-column prop="post_date" label="发布时间" width="220" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="edit_date" label="更新时间" width="220" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="article_status" label="状态" width="120" fixed="right">
        <template v-slot="scope">
          <el-switch :model-value="scope.row.article_status" inline-prompt active-text="已发布" inactive-text="草稿"
            :width="60" active-color="#13ce66" :active-value="1" :inactive-value="0"
            @change="(value) => changeStatus(scope.row, value)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px" fixed="right">
        <template v-slot="scope">
          <el-button type="info" size="small" @click="previewArticle(scope.row?.article_content)">预览</el-button>
          <el-button type="primary" size="small" @click="editArticle(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_nation">
      <el-pagination background layout="prev, pager, next ,sizes,total " :page-sizes="[10, 20]"
        :page-size="queryData.limit" :current-page="queryData.page" :total="totalNum" :hide-on-single-page="true"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <el-drawer title="编辑文章" v-model="showDrawer" direction="rtl" size="60%" destroy-on-close>
      <!-- <ArticleForm v-if="showDrawer" :articleData="editData" @get-url="getUrl" @get-content="getContent"
          @getEditorType="getEditorType" @get-valid="getFormValid" ref="articleFormRef" /> -->
      <ArticleForm v-if="showDrawer" v-model:imgSrc="editData.article_cover" v-model:editorType="editData.editorType"
        v-model:content="editData.article_content" :articleData="editData" ref="articleFormRef" />
      <div class="sub_bths">
        <el-button type="success" @click="saveEdit">保存</el-button>
        <el-button type="info" @click="cancelEdit">取消</el-button>
      </div>
    </el-drawer>
    <el-dialog title="预览" v-model="previewVisible" :destroy-on-close="true" width="80%" center>
      <el-scrollbar class="dialog-center ">
        <v-md-preview :text="previewContent"></v-md-preview>
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setVisible">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.all_article {
  flex-direction: column;

  .search_bar {
    display: flex;
    width: 100%;
    background-color: #fff;
    padding-top: 10px;

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

  .sub_bths {
    margin: 20px auto;
  }
}
</style>
<style lang="less">
.el-table_body tr,
.el-table_body td {
  height: 36px;
}

.el-drawer__header {
  font-size: 22px;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 24px !important;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 0 !important;
}

.el-drawer__body {
  height: calc(100% - 73px);
  overflow-x: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
