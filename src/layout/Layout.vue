<template>
  <el-container style="height:100%">
      <el-aside>
        <div class='logo'>
          <img
            src="../assets/img/logo_touming.png"
          />
          <transition name="fade-enter">
            <span class='text' v-show="!isCollapse">Dunn Blog</span>
          </transition>
        </div>
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :router="true"
          :default-active="$route.path"
        >
          <el-menu-item index="/home">
            <iconpark-icon name="calendar" /> &nbsp;&nbsp;
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
      <el-container>
        <el-header class="m-header">
          <div @click="isCollapse = !isCollapse">
              <iconpark-icon size="24" v-show="isCollapse" name="menu-unfold-one"></iconpark-icon>
              <iconpark-icon size="24" v-show="!isCollapse" name="menu-fold-one"></iconpark-icon>
          </div>
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
        <!-- <el-scrollbar> -->
          <router-view>
            <template #default="{ Component, route }">
                <transition
                name="fade-slide"
                mode="out-in"
                appear
                >
                  <component :is="Component" :key="route.fullPath" />
                </transition>
            </template>
          </router-view>
        <!-- </el-scrollbar> -->
      </el-main>
      </el-container>
  </el-container>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import loginOut from "@/utils/loginOut";
import MMenuItem from "../components/MMenuItem.vue";
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
  .logo {
    padding:10px 4px;
    height:50px;
    display:flex;
    align-items:center;
    img {
     width: 32px;
      height: 32px;
      margin: 0 10px 0 12px;
    }
    .text {
      font-size: 16px;
      font-weight: 700;
      color:#fff
    }
  }
.m-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 30px;
  background-color: #fff!important;
  border-bottom: 1px solid #eee;
  border-left: 1px solid #eee;
  .userinfo {
    display: flex;
    align-items: center;
    color:#000;
    font-size: 14px;
    letter-spacing: 3px;
    .el-avatar {
      margin-right: 10px;
    }
  }
}
:deep(.el-scrollbar) {
  height: calc(100% - 160px);
}
:deep(.el-aside) {
  width: auto !important;
  border-right: solid 1px #e6e6e6;
  background-color: #6e5374;
}
:deep(.el-menu-vertical-demo) {
  // height: calc(100vh - 60px);
  border: none;
  background-color:#6e5374;
  .el-menu--inline {
    background-color:#7d5e85;
  }
  .el-menu-item-group__title {
    padding:0
  }
}
:deep(.el-menu-vertical-demo:not(.el-menu--collapse)) {
  width: 200px;
  min-height: 400px;
}
</style>
