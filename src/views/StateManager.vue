<template>
  <div class="my_card state_manager">
    <el-affix :offset="115">
      <el-form class="search_bar" label-width="70px" label-position="left">
        <el-form-item label="发布者">
          <el-input v-model="queryData.creator"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="getArticle" :loading="queryLoading">查询</el-button>
          <el-button @click="clearQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-affix>
    <el-table :data="sourceData" style="width: 100%" v-loading="queryLoading" element-loading-text="拼命加载中"
      @selection-change="handleSelectionChange" ref="tableRef" @sort-change="handlerSort" border>
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="creator" label="发布者" width="150">
      </el-table-column>
      <el-table-column prop="update_time" label="发布时间" width="220" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="content" label="内容" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div class="page_nation">
      <el-pagination background layout="prev, pager, next ,sizes,total " :page-sizes="[10, 20]"
        :page-size="queryData.limit" :current-page="queryData.page" :total="totalNum" :hide-on-single-page="true"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup name="StateManager">
import { ref, reactive } from "vue";
import dayjs from "dayjs";
import { ElNotification } from "element-plus";
import { apiGetState } from '@/api/state'
interface stateItem {
  id: number
  creator: string
  avatar: string
  content: string
  'update-time': string
}
type query = {
  creator?: string
  limit?: number
  page?: number
}
const sourceData = ref([] as stateItem[])
const queryLoading = ref(false)
const queryData: query = reactive({
})
const totalNum = ref(0)
// 获取文章信息
const getData = async () => {
  queryLoading.value = true;
  // 获取所有文章信息
  const res = await apiGetState(queryData);
  if (res.code === 200) {
    totalNum.value = res.pageNation.total;
    sourceData.value = JSON.parse(JSON.stringify(res.data));
    queryLoading.value = false;
  } else {
    queryLoading.value = false;
    ElNotification({
      type: "error",
      message: "数据加载失败,请刷新页面!",
    });
  }
};

</script>
<style lang='scss' scoped>
.state_manager {
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