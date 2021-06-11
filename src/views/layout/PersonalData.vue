<template>
  <div class="my_card personal_data">
    <el-tabs tab-position="top" style="width: 100%" >
      <el-tab-pane label="个人设置">
        <el-form ref="form" :model="userForm" label-width="80px" label-position="top" style="width: 310px" size="small">
          <el-form-item label="用户昵称">
            <el-input v-model="userForm.user_nickname"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userForm.phone" disabled></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="userForm.sex" placeholder="性别">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userForm.email" ></el-input>
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input type="textarea" :rows="4" v-model="userForm.signature"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="">立即更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {onMounted, reactive, toRefs} from "vue";
import {useStore} from 'vuex'
export default {
  name: "PersonalData",
  setup() {
    const store = useStore()
    const state  = reactive({
      userForm:{}
    })
    onMounted(()=>{
      const { userinfo } = store.state
      state.userForm= Object.assign({},userinfo)
    })
    console.log('userinfo',state.userForm)
    return{
      ...toRefs(state)
    }
  }
}
</script>

<style scoped lang="scss">
 .personal_data {
   justify-content: left;
 }
</style>
