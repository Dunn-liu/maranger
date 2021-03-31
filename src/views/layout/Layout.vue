<template>
  <el-container>
    <el-header class="m-header">
      <img class="logo" src="../../assets/img/logo.png" @click="isCollapse=!isCollapse">
      <div class="userinfo">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :src="userinfo.avatar" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item @click="logOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        &nbsp;欢迎您,&nbsp;{{ userinfo.user_nickname }}
      </div>
    </el-header>
    <el-container>
      <el-aside width="201px">
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" :router="true" :default-active="$route.path">
          <el-menu-item index="/home">
              <i class="el-icon-s-home"></i>
              <span slot="title">主页</span>
          </el-menu-item>
          <template v-for="(item,index) in store.state.userRouters" :key="item.id">
            <MMenuItem :isCollapse =isCollapse :item="item" :index="index" />
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {defineComponent, onMounted, reactive, ref, toRefs,} from 'vue'
import {useRouter} from 'vue-router'
import {apiGetUserInfo} from '@/api/userInfo.js'
import {localRemove} from '@/utils/local'
import MMenuItem from '../../components/MenuItem.vue'
import {useStore} from "vuex";
export default defineComponent({
  components:{
    MMenuItem
  },
  name:'Layout',
  setup(){
    const router = useRouter()
    const store = useStore()
    const isCollapse = ref(false)
    const state = reactive({
      userinfo:{},
      newAuth:[],
    })
    onMounted(async ()=>{
      const res = await apiGetUserInfo()
      state.userinfo = res.info
      // const auth = await apiGetUserAuth(res.info.phone)
      // const addAuth = generateRouter(formatRouterTree(auth.auth))
      // state.newAuth= addAuth
      // console.log(addAuth)
      // addAuth.forEach(item=>{
      //   router.addRoute('Home',item)
      // })
      console.log(router.getRoutes())
      // store.commit('saveAuth',true)
    })
    const logOut = ()=>{
      localRemove('token')
      router.push('/login')
    }
    return {
      router,
      store,
      ...toRefs(state),
      logOut,
      isCollapse
    }
  }
})
</script>

<style lang="scss">
  .m-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #00B7FF;
    padding-left: 30px;
    .logo{
      width: 50px;
      height: 35px;
      border-radius: 50%;
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
  .el-menu-vertical-demo{
    height: calc(100vh - 60px);
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

</style>
