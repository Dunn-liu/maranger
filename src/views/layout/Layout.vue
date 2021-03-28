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
        <MMenu :isCollapse =isCollapse  />
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
import MMenu from '../../components/Menu.vue'
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue'
import {apiGetUserInfo} from '@/api/userInfo.js'
import {useRouter} from 'vue-router'
import {localRemove} from '@/utils/local'
export default defineComponent({
  components:{
    MMenu
  },
  name:'Layout',
  setup(){
    const router = useRouter()
    const isCollapse = ref(false)
    const state = reactive({
      userinfo:{}
    })
    // const avatarSrc = ref('http://thirdqq.qlogo.cn/g?b=oidb&k=czATMziaPGViaicIrrbIyla5g&s=640&t=1613788120')
    onMounted(async ()=>{
      const res = await apiGetUserInfo()
      state.userinfo = res.info
    })
    const logOut = ()=>{
      localRemove('token')
      router.push('/login')
    }
    console.log(state)
    return {
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

</style>
