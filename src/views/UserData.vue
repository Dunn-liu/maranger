<template>
  <div>
    <div class="my_card user-card">
      <el-form
        class="search_bar flex flex-wrap"
        label-width="70px"
        label-position="left"
      >
        <el-form-item label="邮箱">
          <el-input v-model="queryData.email"></el-input>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select
            v-model="queryData.status"
            placeholder="请选择"
            collapse-tags
            clearable
          >
            <el-option :key="1" label="有效" :value="1"> </el-option>
            <el-option :key="0" label="禁用" :value="0"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型">
          <el-select
            v-model="queryData.type"
            placeholder="请选择"
            collapse-tags
            clearable
          >
            <el-option :key="1" label="超级管理员" :value="1"> </el-option>
            <el-option :key="2" label="管理员" :value="2"> </el-option>
            <el-option :key="3" label="用户" :value="3"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="clearQuery">清除</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="tableRef"
        v-loading="state.loading"
        :data="state.dataSource"
        style="width: 100%"
        element-loading-text="拼命加载中"
        border
      >
        <el-table-column
          fixed
          width="220"
          prop="email"
          label="邮箱"
        />
        <el-table-column prop="user_type" label="账号类型" width="120">
          <template #default="scope">
            {{ AUTH_MAP[scope.row.user_type] }}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180" show-overflow-tooltip />
        <el-table-column prop="sex" label="性别">
          <template #default="scope">
            {{ scope.row.sex === "0" ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="user_nickname" label="昵称" width="160" show-overflow-tooltip />
        <el-table-column label="地址" width="220" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.area">{{ scope.row.area.replaceAll(" / ","") }}</span
            >
            <span v-if="scope.row.address">{{ scope.row.address.replaceAll(" / ","") }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_status" label="账号状态">
          <template #default="scope">
            {{ scope.row.user_status === 1 ? "有效" : "禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="resetPassWord(scope.row.id)"
              >重置密码</el-button
            >
            <el-button type="text" @click="handleShowDrawer(scope.row)"
              >权限</el-button
            >
            <el-button type="text" @click="changeStatus(scope.row)"
              >{{ scope.row.user_status === 1 ? "禁用" : "启用" }}
            </el-button>
            <el-button
              v-if="state.isSuperAdmin"
              type="text"
              style="color: #f56c6c"
              @click="deleteUser(scope.row.id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="totalNum > 0" class="page_nation">
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
    <el-dialog v-model="state.showDrawer" title="用户权限" destroy-on-close>
      <el-tree
        ref="treeRef"
        :data="routerData"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-checked-keys="state.checkKeys"
      />
      <div style="display: flex; justify-content: center; margin-top: 200px">
        <el-button type="primary" @click="confirmEdit">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="UserData">
import { ref, reactive, onMounted } from "vue"
import {
  apiGetRouterAll,
  apiGetUserList,
  apiChangeStatus,
  apiResetPassWord,
  apiUpdateRouter,
  apiDelUser,
} from "@/api/auth"
import { formatRouterTree } from "@/utils/routerFormat"
import { AUTH_MAP } from "@/config/config";
import dayjs from "dayjs";
import { useUserStore } from "@/store/modules/user";
onMounted(async () => {
  const res = await apiGetRouterAll()
  routerData.value = formatRouterTree(res?.data)
  await getDataSource()
  state.isSuperAdmin = userStore.getUserInfo.user_type === 1
});
const routerData = ref([])
const userStore = useUserStore()
const treeRef = ref()
const state = reactive({
  dataSource: [],
  loading: false,
  showDrawer: false,
  checkKeys: [],
  currentId: null,
  isSuperAdmin: false,
});
const defaultProps = reactive({
  children: "children",
  label: "title",
})
const queryData = reactive({
  email: "",
  status: "",
  type: "",
  page: 1,
  limit: 10,
})
const totalNum = ref(0)
const getDataSource = async () => {
  state.loading = true
  const res = await apiGetUserList({ ...queryData })
  state.loading = false
  state.dataSource = res?.data.map((item) => {
    item.create_time = dayjs(item.create_time).format("YYYY-MM-DD HH:mm:ss");
    return item
  });
  totalNum.value = res?.pageNation?.total;
};
const changeStatus = async (row: any) => {
  const { id, user_status } = row
  const status = user_status === 1 ? 0 : 1
  const res = await apiChangeStatus({ id, status })
  if (res.code === 200) {
    state.dataSource.forEach((item: UserInfo) => {
      if (item.id === id) {
        if (item.user_status === 1) {
          item.user_status = 0;
        } else {
          item.user_status = 1;
        }
      }
    });
  }
  // @ts-ignore
  ElMessage({
    type: "success",
    showClose: true,
    duration: 1500,
    message: user_status === 1 ? "账号禁用成功!" : "账号启用成功!",
  });
};
const getList = async () => {
  await getDataSource();
};
const clearQuery = async () => {
  queryData.status = ""
  queryData.email = ""
  queryData.type = ""
  await getDataSource();
};
// 分页功能方法
const handleCurrentChange = async (val) => {
  queryData.page = val;
  await getDataSource();
}
const handleSizeChange = async (val) => {
  queryData.page = 1;
  queryData.limit = val;
  await getDataSource();
}
// 重置密码
const resetPassWord = async (id) => {
  const res = await apiResetPassWord(id)
  if (res.code === 200) {
    // @ts-ignore
    ElMessage({
      type: "success",
      showClose: true,
      duration: 1500,
      message: "账号密码重置成功，请及时联系用户修改密码!",
    });
  }
}
const handleShowDrawer = (row: any) => {
  console.log("roew", row)
  state.checkKeys = row.auth.split(",")
  state.showDrawer = true
  state.currentId = row.id
};
const confirmEdit = async () => {
  const auth = treeRef.value.getCheckedKeys().join(",")
  const res = await apiUpdateRouter({ id: state.currentId, auth })
  if (res.code === 200) {
    state.showDrawer = false
    // @ts-ignore
    ElMessage({
      type: "success",
      showClose: true,
      duration: 1500,
      message: "操作成功!",
    });
    await getDataSource()
  }
}
const deleteUser = (id) => {
  // @ts-ignore
  ElMessageBox.confirm("此操作不可恢复，确认删除此用户?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    center: true,
  })
    .then(async () => {
      const res = await apiDelUser(id)
      if (res.code === 200) {
        // @ts-ignore
        ElMessage({
          type: "success",
          showClose: true,
          duration: 1500,
          message: "删除操作成功！",
        });
        state.dataSource = state.dataSource.filter(
          (item: UserInfo) => item.id !== id
        )
      }
    })
    .catch(() => {})
};
</script>

<style scoped>
.user-card {
  flex-direction: column;
}
</style>
