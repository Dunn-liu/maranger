<template>
  <el-container>
    <el-header class="m-header">
      <img class="logo" src="../../assets/img/logo.png">
      <div class="userinfo">
        <el-avatar :src="avatarSrc" />
        <el-dropdown class="dropdown">
          <el-button type="primary">
            用户1232456<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <MMenu />
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
import MMenu from '../../components/Menu.vue'
// import {getUserRouters} from '@/api/login.js'
export default {
  name: "Layout",
  components:{
    MMenu
  },
  data(){
    return {
      avatarSrc:'http://thirdqq.qlogo.cn/g?b=oidb&k=czATMziaPGViaicIrrbIyla5g&s=640&t=1613788120'
    }
  },
}
</script>

<style lang="scss">
  .m-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #409EFF;
    padding-left: 30px;
    .logo{
      width: 90px;
      height: 60px;
      border-radius: 50%;
    }
    .userinfo {
      display: flex;
      align-items: center;
      .dropdown{
        margin-left: 12px;
      }
    }
  }

</style>
