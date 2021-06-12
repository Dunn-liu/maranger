<template>
  <div class="my_card personal_data">
    <el-tabs tab-position="top" style="width: 100%" >
      <el-tab-pane label="个人设置">
        <el-form ref="form" :model="userForm" label-width="80px" label-position="top" style="width: 310px" size="small">
          <el-form-item label="角色类型">
            <el-input v-model="AUTH_MAP[userForm.user_type]" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userForm.phone" disabled></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-input v-model="userForm.create_time" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称">
            <el-input v-model="userForm.user_nickname"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="userForm.sex" placeholder="性别">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
                    v-model="userForm.birthday"
                    type="date"
                    placeholder="选择日期"
                    >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userForm.email" ></el-input>
          </el-form-item>
          <el-form-item label="地区">
            <el-cascader :props="props" show-all-levels v-model="userForm.area" :placeholder="userinfo.area"></el-cascader>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="userForm.address"></el-input>
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input type="textarea" :rows="4" v-model="userForm.signature"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="updateInfo">立即更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="头像设置">
        <div class="avatar">
          <el-avatar icon="el-icon-user-solid" :size="80" fit="cover" :src="userinfo.avatar"></el-avatar>
            <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :http-request="httpRequest"
                    action=""
            >
              <el-button type="primary" size="mini">上传</el-button>
            </el-upload>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {onMounted, reactive, toRefs, watch} from "vue";
import {useStore} from 'vuex'
import dayjs from 'dayjs'
import { AUTH_MAP } from "../../config/config";
import useImgRequest from "../../utils/imgHttpRequest";
import {apiGetArea} from "../../api/area";
import {apiUpdateAvatar,apiUpdateInfo} from "../../api/userInfo";
  import {ElMessage} from "element-plus";

  export default {
  name: "PersonalData",
  setup() {
    const store = useStore()
    const state  = reactive({
      userForm: {
      },
      userinfo:{},
      props: {
        lazy: true,
        value:'label',
        label:'label',
        lazyLoad: async (node, resolve) => {
          const { level,data:{ key } } = node;
          const res = await apiGetArea(key)
          const nodes = res?.districts[0]?.districts.map(item => {
            return {
              label: item.name,
              key: item.adcode,
              leaf: level >= 3
            }
          })
          resolve(nodes);
        }
      }
    })
    const { httpRequest , resSrc} = useImgRequest()
    watch(resSrc,async (newVal)=>{
      state.userForm.avatar = newVal
      const {phone} = state.userForm
      const res = await apiUpdateAvatar({phone,avatar:newVal})
      if (res.code===200) {
        await getUserInfo()
      }
    })
    const getUserInfo = async () => {
      await store.dispatch('getUserInfo')
      state.userinfo = store.state.userinfo
      const { userinfo } = state
      userinfo.create_time = dayjs(userinfo.create_time).format('YYYY-MM-DD HH:mm:ss')
      // userinfo.user_type = AUTH_MAP[userinfo.user_type]
      state.userForm= Object.assign({},userinfo)
      console.log(state.userForm)
    }
    onMounted(async ()=>{
     await getUserInfo()
    })
    const updateInfo = async () => {
      const {userForm} = state
      const newForm = Object.assign({},userForm)
      newForm.birthday = dayjs(newForm.birthday).format('YYYY-MM-DD')
      newForm.area = Array.isArray(newForm.area) ? newForm.area.join(' / ') : newForm.area
      delete newForm.avatar
      const res = await apiUpdateInfo(newForm)
      if (res.code===200) {
        await getUserInfo()
        ElMessage({
          type:'success',
          message:'更新成功!',
          showClose: true
        })
      }else {
        ElMessage({
          type:'error',
          message:'更新失败!',
          showClose: true
        })
      }
    }
    return{
      ...toRefs(state),
      updateInfo,
      httpRequest,
      AUTH_MAP
    }
  }
}
</script>

<style lang="scss">
 .personal_data {
   justify-content: left;
   .avatar {
     /*min-height: 200px;*/
     width: 200px;
     display: flex;
     align-items: center;
     justify-content: space-evenly;
     .el-avatar>img{
       width: 100%;
     }
   }
 }
</style>
