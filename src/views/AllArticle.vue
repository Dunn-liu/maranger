<template>
  <div class="my_card all_article">
    <el-form class="search_bar" label-width="70px" label-position="left">
      <el-form-item label="关键词">
        <el-input v-model="queryData.keyword"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          v-model="queryData.classifyId"
          placeholder="请选择"
          collapse-tags
          clearable
        >
          <el-option
            v-for="item in classify"
            :key="item.id"
            :label="item.classifyName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章状态">
        <el-select
          placeholder="请选择"
          collapse-tags
          v-model="queryData.articleStatus"
          clearable
        >
          <el-option label="已发布" :value="1" :key="1"> </el-option>
          <el-option label="未发布" :value="0" :key="0"> </el-option>
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
      v-loading="loading"
      element-loading-text="拼命加载中"
      @selection-change="handleSelectionChange"
      ref="tableRef"
      :default-sort="{ prop: 'id', order: 'descending' }"
      @sort-change="handlerSort"
      border
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column fixed prop="id" label="ID" width="50" sortable="custom">
      </el-table-column>
      <el-table-column prop="article_title" label="标题" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="classifyId" label="分类">
        <template v-slot="scope">
          <template v-for="(item, index) in scope.row.classifyId">
            {{ filterClassify(item).classifyName }}
            {{ scope.row.classifyId.length === index + 1 ? "" : "," }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="author_nickname" label="作者" width="80">
      </el-table-column>
      <el-table-column prop="post_date" label="发布时间" width="150" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="edit_date" label="更新时间" width="150" sortable="custom" show-overflow-tooltip>
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="article_content"-->
<!--        label="内容"-->
<!--        show-overflow-tooltip-->
<!--      >-->
<!--      </el-table-column>-->
      <el-table-column prop="article_status" label="状态" width="80">
        <template v-slot="scope">
          <el-tag
            :type="scope.row.article_status === 1 ? 'success' : 'primary'"
            disable-transitions
            >{{ scope.row.article_status === 1 ? "已发布" : "草稿" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="info" size="mini" @click="previewArticle(scope.row?.article_content)"
          >预览</el-button
          >
          <el-button type="primary" size="mini" @click="editArticle(scope.row)"
          >编辑</el-button
          >
          <el-button
            v-if="scope.row.article_status !== 1"
            @click="changeStatus(scope.row, '1')"
            type="success"
            size="mini"
            >发布</el-button
          >
          <el-button
            v-else
            type="warning"
            size="mini"
            @click="changeStatus(scope.row, '0')"
            >下架</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="page_nation" v-if="totalNum > 0">
      <el-pagination
        background
        layout="prev, pager, next ,sizes,total "
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
    size="60%"
    destroy-on-close
  >
    <ArticleForm
      v-if="showDrawer"
      :articleData="editData"
      @get-url="getUrl"
      @get-content="getContent"
      @getEditorType="getEditorType"
      @get-valid="getFormValid"
      ref="articleFormRef"
    />
    <div class="sub_bths">
      <el-button type="success" @click="saveEdit">保存</el-button>
      <el-button type="success" @click="cancelEdit">取消</el-button>
    </div>
  </el-drawer>
  <PreView :centerDialogVisible="previewVisible" :text="previewContent" />
</template>

<script>
import { defineAsyncComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import {
  apiDelArticle,
  apiGetArticle,
  apiGetClassify,
  apiUpdateArticle,
  apiChangeStatus
} from "../api/article";
import dayjs from "dayjs";
import Loading from "@/components/Loading.vue";
import PreView from '@/components/PreView.vue'
const ArticleForm = defineAsyncComponent({
  loader: () => import("@/components/ArticleForm.vue"),
  loadingComponent: Loading,
});
export default {
  name: "AllArticle",
  components: { ArticleForm,PreView },
  setup() {
    let formValid = null;
    const articleFormRef = ref(null);
    const tableRef = ref(null);
    const previewVisible = ref(false)
    const previewContent = ref('')
    const state = reactive({
      articleData: [], // 页面文章数据
      queryData: {
        keyword: "",
        classifyId: "",
        articleStatus: "",
        page: 1,
        limit: 10,
        orderSort: {},
      },
      loading: false,
      showDrawer: false,
      editData: {}, //当前编辑文章数据
      classify: [], // 所有分类信息
      multipleSelection: [], // 选中的文章id
      delSelect: "",
      totalNum: 0,
    });
    onMounted(async () => {
      await getArticle();
      // 获取分类数据
      const classifyData = await apiGetClassify();
      state.classify = classifyData.data;
      tableRef.value.doLayout(); // 解决表格有时表头错位问题
    });
    // 获取文章信息
    const getArticle = async () => {
      state.loading = true;
      // 获取所有文章信息
      const res = await apiGetArticle(state.queryData);
      if (res.code === 200) {
        res.data.forEach((item) => {
          item.edit_date = dayjs(item.edit_date).format("YYYY-MM-DD HH:mm:ss");
          item.post_date = dayjs(item.post_date).format("YYYY-MM-DD HH:mm:ss");
          item.classifyId = item.classifyId.split(",").map((c) => {
            c = Number(c);
            return c;
          });
        });
        state.totalNum = res.pageNation.total;
        state.articleData = JSON.parse(JSON.stringify(res.data));
        state.loading = false;
      } else {
        state.loading = false;
        ElNotification({
          type: "error",
          message: "数据加载失败,请刷新页面!",
        });
      }
    };
    // 获取表单验证结果
    const getFormValid = (e) => {
      formValid = e;
    };
    const getEditorType = (e) => {
      state.editData.editorType = e;
    };
    const getUrl = (e) => {
      state.editData.article_cover = e;
    };
    const getContent = (e) => {
      state.editData.article_content = e;
    };
    // 打开编辑抽屉弹窗
    const editArticle = (row) => {
      state.editData = JSON.parse(JSON.stringify(row));
      state.showDrawer = true;
    };
    // 保存编辑
    const saveEdit = async () => {
      articleFormRef.value.validateForm();
      if (!formValid) {
        ElNotification({
          type: "error",
          message: "请检查表单内容!",
          duration: 2000,
        });
      } else {
        const newEditData = JSON.parse(JSON.stringify(state.editData));
        (newEditData.post_date = dayjs(newEditData.post_date).format(
          "YYYY-MM-DD HH:mm:ss"
        )),
          (newEditData.classifyId = newEditData.classifyId.join(","));
        const res = await apiUpdateArticle(newEditData);
        if (res.code === 200) {
          ElNotification({
            type: "success",
            message: "文章更新成功!",
            duration: 2000,
          });
          await getArticle();
          state.showDrawer = false;
        }
      }
    };
    // 取消编辑
    const cancelEdit = () => {
      state.showDrawer = false;
    };
    // 根据分类id获取完成分类信息
    const filterClassify = (id) => {
      if (state.classify.length === 0) {
        return "";
      } else {
        return state.classify.filter((item) => {
          return item.id === id;
        })[0];
      }
    };
    // 清空搜索表单
    const clearQuery = async () => {
      state.queryData = {
        keyword: "",
        classifyId: "",
        articleStatus: "",
      };
      await getArticle();
    };
    // 选择文章
    const handleSelectionChange = (val) => {
      state.multipleSelection = val;
      state.delSelect = state.multipleSelection
        .map((item) => {
          return item.id;
        })
        .join(",");
    };
    const delArticle = async () => {
      if (!state.delSelect) {
        ElMessage.warning({
          showClose: true,
          duration: 1500,
          message: "请先选中需要操作的文章!",
          type: "warning",
        });
      } else {
        ElMessageBox.confirm("此操作不可恢复, 是否继续删除文章?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const res = await apiDelArticle({ id: state.delSelect });
            if (res.code === 200) {
              ElMessage.warning({
                showClose: true,
                duration: 1500,
                message: "删除成功!",
                type: "success",
              });
              await getArticle();
            }
          })
          .catch(() => {
            tableRef.value.clearSelection();
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
      state.queryData.page = val;
      await getArticle();
    };
    const handleSizeChange = async (val) => {
      state.queryData.page = 1;
      state.queryData.limit = val;
      await getArticle();
    };
    const handlerSort = async ({ prop, order }) => {
      if (prop) {
        state.queryData.orderSort = {};
        state.queryData.orderSort[prop] =
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
        ElMessage({
          type: type === "0" ? "warning" : "success",
          showClose: true,
          duration: 1500,
          message: type === "0" ? "文章下架成功!" : "文章发布成功!",
        });
        state.articleData.forEach((item) => {
          if (item.id === row.id) {
            if (item.article_status === 0) {
              item.article_status = 1;
            } else {
              item.article_status = 0;
            }
          }
        });
      }
    };
    // 预览
    const previewArticle = (content) => {
      previewVisible.value = true
      previewContent.value=content
      console.log(content)
    }
    return {
      articleFormRef,
      tableRef,
      previewVisible,
      previewContent,
      ...toRefs(state),
      editArticle,
      getFormValid,
      getEditorType,
      getUrl,
      getContent,
      saveEdit,
      cancelEdit,
      filterClassify,
      getArticle,
      clearQuery,
      handleSelectionChange,
      delArticle,
      handleCurrentChange,
      handleSizeChange,
      handlerSort,
      changeStatus,
      previewArticle
    };
  },
};
</script>

<style lang="scss">
.all_article {
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
}
.page_nation {
  margin: 20px auto 10px;
}
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
.sub_bths {
  margin: 20px auto;
}
</style>
