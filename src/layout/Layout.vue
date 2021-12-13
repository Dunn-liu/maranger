<template>
  <el-container>
    <el-header class="m-header">
      <img
        class="logo"
        src="../assets/img/logo.png"
        @click="isCollapse = !isCollapse"
      />
      <div class="userinfo">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :src="$store.state.userinfo.avatar" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/personalSetting')"
                >个人中心</el-dropdown-item
              >
              <el-dropdown-item @click="logOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        &nbsp;欢迎您,&nbsp;{{ $store.state.userinfo.user_nickname }}
      </div>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :router="true"
          :default-active="$route.path"
        >
          <el-menu-item index="/home">
            <i class="el-icon-s-home"></i>
            <template #title>日历</template>
          </el-menu-item>
          <template
            v-for="(item, index) in $store.state.userRouters"
            :key="item.id"
          >
            <MMenuItem :isCollapse="isCollapse" :item="item" :index="index" />
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <el-page-header
          style="
            border-bottom: 1px solid #ebeef5;
            padding-bottom: 10px;
            margin-bottom: 0;
          "
          icon="el-icon-arrow-left"
          @back="goBack"
          :content="$store.state.headerTitle"
        ></el-page-header>
        <el-scrollbar>
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import loginOut from "@/utils/loginOut";
import MMenuItem from "../components/MenuItem.vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    MMenuItem,
  },
  name: "Layout",
  setup() {
    const router = useRouter();
    const store = useStore();
    const isCollapse = ref(false);
    const logOut = () => {
      loginOut()
    };
    onMounted(async () => {
      if (JSON.stringify(store.state.userinfo) === "{}") {
        store.dispatch("getUserInfo");
      }
    });
    const goBack = () => {
      router.go(-1);
    };
    return {
      router,
      logOut,
      isCollapse,
      goBack,
    };
  },
});
</script>

<style lang="scss" scoped>
.m-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #7d5e85;
  padding-left: 30px;
  .logo {
    width: 115px;
    height: 50px;
  }
  .userinfo {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 14px;
    letter-spacing: 3px;
    .el-avatar {
      margin-right: 10px;
    }
  }
}
:deep(.el-scrollbar) {
  height: calc(100vh - 160px);
}
:deep(.el-aside) {
  width: auto !important;
  border-right: solid 1px #e6e6e6;
}
:deep(.el-menu-vertical-demo) {
  height: calc(100vh - 60px);
  border: none;
}
:deep(.el-menu-vertical-demo:not(.el-menu--collapse)) {
  width: 200px;
  min-height: 400px;
}
</style>
