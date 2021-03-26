<template>
  <el-container>
    <el-header class="m-header">
      <img class="logo" src="../../assets/img/logo.png">
      <div class="userinfo">
        <el-avatar :src="avatarSrc" />欢迎您,{{  }}
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
import {mapState} from 'vuex'
import {defineComponent, onMounted, ref} from 'vue'
import {apiGetUserInfo} from '@/api/userInfo.js'
import {useRouter} from 'vue-router'
import {localRemove} from '@/utils/local'
import {ElMessage} from 'element-plus'
export default defineComponent({
  name:'Layout',
  setup(){
    const router =useRouter()
    const avatarSrc = ref('http://thirdqq.qlogo.cn/g?b=oidb&k=czATMziaPGViaicIrrbIyla5g&s=640&t=1613788120')
    onMounted(async ()=>{
      const res = await apiGetUserInfo()
      console.log(res)
    })
    return {avatarSrc}
  }
})
  // name: "Layout",
  // components:{
  //   MMenu
  // },
  // computed:{
  //   ...mapState(['userinfo'])
  // },
  // data(){
  //   return {
  //     avatarSrc:'http://thirdqq.qlogo.cn/g?b=oidb&k=czATMziaPGViaicIrrbIyla5g&s=640&t=1613788120'
  //   }
  // },
</script>

<style lang="scss">
  .m-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #409EFF;
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
