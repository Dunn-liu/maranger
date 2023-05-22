<template>
  <div class="my_card">
    <Search ref="searchRef" @search="handleSearch" @reset="handleReset" :schema="schema" labe-width="70px" layout="inline"
      buttom-position="left" />
    <Table ref="tableRef" :columns="columns" border :data="dataSource" :loading="loading" @init="initGetlist"
      :default-sort="{ prop: 'id', order: 'descending' }" :pagination="{
        total: pageInfo.total
      }" v-model:currentPage="pageInfo.page" v-model:pageSize="pageInfo.limit">
      <template #address="{ row }">
        <span v-if="row.area">{{ row.area.replaceAll(" / ", "") }}</span>
        <span v-if="row.address">{{ row.address.replaceAll(" / ", "") }}</span>
      </template>
      <template #action="{ row }">
        <el-button link type="primary" @click="resetPassWord(row.id)">重置密码</el-button>
        <el-button link type="primary" @click="handleShowDrawer(row)">权限</el-button>
        <el-button link type="primary" @click="changeStatus(row)">{{ row.user_status === 1 ? "禁用" : "启用" }}
        </el-button>
        <el-button v-if="isSuperAdmin" link type="danger" @click="deleteUser(row.id)">删除
        </el-button>
      </template>
    </Table>
    <Dialog v-model="showDrawer" title="用户权限" destroy-on-close>
      <el-tree ref="treeRef" :data="routerData" show-checkbox node-key="id" :props="defaultProps"
        :default-checked-keys="checkKeys" />

      <template #footer>
        <el-button type="primary" @click="confirmEdit">确认修改</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup name="UserData">
import { ref, reactive, onMounted, computed } from "vue"
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
import { FormSchema } from "@/types/form";
import { TableColumn } from "@/types/table";
import { omit } from "lodash";
const isSuperAdmin = computed(() => {
  return userStore.getUserInfo.user_type === 1
})
onMounted(async () => {
  const res = await apiGetRouterAll()
  routerData.value = formatRouterTree(res?.data)
  await initGetlist()
});
const routerData = ref([])
const userStore = useUserStore()
const treeRef = ref()
const searchRef = ref()
const columns: TableColumn[] = [
  {
    field: 'email',
    label: '邮箱'
  },
  {
    field: 'user_type',
    label: '账号类型',
    width: '160',
    formatter: (row: Recordable) => {
      return AUTH_MAP[row.user_type]
    }
  },
  {
    field: 'create_time',
    label: '创建时间'
  },
  {
    field: 'sex',
    label: '性别',
    width: '120',
    formatter: (row: Recordable) => {
      return row.sex === "0" ? "男" : "女"
    }
  },
  {
    field: 'user_nickname',
    label: '昵称',
    width: '160'
  },
  {
    field: 'address',
    label: '地址',
    width: '200'
  },
  {
    field: 'user_status',
    label: '账号状态',
    width: '120',
    formatter: (row: Recordable) => {
      return row.user_status === 1 ? "有效" : "禁用"
    }
  },
  {
    field: 'action',
    label: '操作'
  }
]
const schema = ref<FormSchema[]>([
  {
    field: 'email',
    label: "邮箱",
    component: 'Input'
  },
  {
    field: 'status',
    label: "账号状态",
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '有效',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        }
      ]
    }
  },
  {
    field: 'type',
    label: "账号类型",
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '超级管理员',
          value: 1
        },
        {
          label: '管理员',
          value: 2
        },
        {
          label: '用户',
          value: 3
        }
      ]
    }
  }
])
const initGetlist = async () => {
  const model = await searchRef?.value?.getModel?.()
  await getDataSource(model);
}
const defaultProps = reactive({
  children: "children",
  label: "title",
})
const pageInfo = reactive({
  page: 1,
  limit: 10,
  total: 0
})
const loading = ref(false)
const dataSource = ref([])
const getDataSource = async (model) => {
  loading.value = true
  const res = await apiGetUserList({ ...omit(pageInfo, 'total'), ...model })
  loading.value = false
  dataSource.value = res?.data.map((item) => {
    item.create_time = dayjs(item.create_time).format("YYYY-MM-DD HH:mm:ss");
    return item
  });
  pageInfo.total = res?.pageNation?.total;
};
const changeStatus = async (row: any) => {
  const { id, user_status } = row
  const status = user_status === 1 ? 0 : 1
  const res = await apiChangeStatus({ id, status })
  if (res.code === 200) {
    dataSource.value.forEach((item: UserInfo) => {
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
const handleSearch = async (model: any) => {
  await getDataSource(model);
}
const handleReset = async (model: any) => {
  await getDataSource(model);
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
const checkKeys = ref<string[]>([])
const showDrawer = ref(false)
const currentId = ref('')
const handleShowDrawer = (row: any) => {
  checkKeys.value = row.auth.split(",")
  showDrawer.value = true
  currentId.value = row.id
};
const confirmEdit = async () => {
  const auth = treeRef.value.getCheckedKeys().join(",")
  const res = await apiUpdateRouter({ id: currentId.value, auth })
  if (res.code === 200) {
    showDrawer.value = false
    // @ts-ignore
    ElMessage({
      type: "success",
      showClose: true,
      duration: 1500,
      message: "操作成功!",
    });
    await initGetlist()
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
        dataSource.value = dataSource.value.filter(
          (item: UserInfo) => item.id !== id
        )
      }
    })
    .catch(() => { })
};
</script>
