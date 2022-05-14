<template>
  <div class="my_card img_data">
    <div class="upload">
      <Upload @uploadSuc="uploadSuc" />
    </div>
    <!-- <el-affix> -->
    <el-form class="search_bar flex flex-wrap" label-width="70px" label-position="left">
      <el-form-item label="ID" label-width="40px">
        <el-input v-model="query.id" type="number"></el-input>
      </el-form-item>
      <el-form-item label="图片名">
        <el-input v-model="query.name"></el-input>
      </el-form-item>
      <el-form-item label="上传时间">
        <el-date-picker v-model="query.update_time" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" @click="fetchImages" :loading="loading">查询</el-button>
        <el-button @click="clearQuery">清除</el-button>
      </el-form-item>
    </el-form>
    <!-- </el-affix> -->
    <el-table :data="imgData" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" ref="tableRef"
      :default-sort="{ prop: 'id', order: 'descending' }" @sort-change="handlerSort" border>
      <el-table-column fixed prop="id" label="ID" width="100" sortable="custom">
      </el-table-column>
      <el-table-column prop="name" label="图片名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="desc" label="图片描述" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="src" label="图片路径">
        <template v-slot="scope">
          <el-link :href="scope.row.src" target="_blank" :underline="false" type="primary">{{ scope.row.src }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="上传时间" sortable="custom">
      </el-table-column>
      <el-table-column label="内容" show-overflow-tooltip>
        <template v-slot="scope">
          <el-image style="width: 200px; height: 100px" :src="scope.row.src" :preview-src-list="[scope.row.src]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="small" type="primary" @click="copyUrl(scope.row.src)">复制链接</el-button>
          <el-popconfirm title="确认删除? 删除后不可恢复!" @confirm="delImage(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_nation">
      <el-pagination background layout="prev, pager, next ,sizes,total " :page-sizes="[5, 10, 20]"
        :page-size="query.limit" :current-page="query.currentPage" :total="totalNum"
        @current-change="handleCurrentChange" @size-change="handleSizeChange" :hide-on-single-page="true">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import Upload from "@/components/Upload.vue";
import { apiGetImages, apiDelImage } from "@/api/image";
// import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import copyUrl from "@/utils/copy";
export default defineComponent({
  name: "ImgData",
  components: {
    Upload,
  },
  setup() {
    const state = reactive({
      imgData: [],
      query: {
        id: "",
        name: "",
        update_time: "",
        currentPage: 1,
        limit: 5,
        orderSort: {},
      },
      totalNum: 0,
      loading: false,
    });
    const fetchImages = async () => {
      state.loading = true;
      const { query } = state;
      if (query.update_time) {
        query.update_time = dayjs(query.update_time).format("YYYY-MM-DD");
      }
      const res = await apiGetImages(query);
      res.data.forEach((item) => {
        item.update_time = dayjs(item.update_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      });
      state.imgData = [...res.data];
      state.loading = false;
      state.totalNum = res?.pageNation?.total;
    };
    onMounted(async () => {
      await fetchImages();
    });
    const handlerSort = async ({ prop, order }) => {
      if (prop) {
        state.query.orderSort = {};
        state.query.orderSort[prop] = order === "ascending" ? "asc" : "desc";
        await fetchImages();
      }
    };
    // 分页功能方法
    const handleCurrentChange = async (val) => {
      state.query.currentPage = val;
      await fetchImages();
    };
    const handleSizeChange = async (val) => {
      state.query.currentPage = 1;
      state.query.limit = val;
      await fetchImages();
    };
    const uploadSuc = async () => {
      await fetchImages();
    };
    const delImage = async (id) => {
      const res = await apiDelImage(id);
      if (res && res.code === 200) {
        ElMessage({
          type: "success",
          message: "删除成功!",
          showClose: true,
        });
        state.imgData = state.imgData.filter(item => item.id !== id)
      }
    };
    const clearQuery = async () => {
      state.query = {
        id: "",
        name: "",
        update_time: "",
      };
      await fetchImages();
    };
    return {
      ...toRefs(state),
      fetchImages,
      handlerSort,
      handleCurrentChange,
      handleSizeChange,
      uploadSuc,
      delImage,
      clearQuery,
      copyUrl,
    };
  },
});
</script>

<style scoped lang="scss">
.img_data {
  flex-direction: column;

  .upload {
    padding-bottom: 10px;
  }

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

  .dialog_content {
    display: flex;
    justify-content: center;
  }

  .page_nation {
    margin: 20px auto 10px;
  }
}
</style>
