<template>
  <div class="login">
    <div class="login-conent">
      <div class="login-header">
        登录
      </div>
      <div class="inner-conent">
        <el-form
            :model="loginForm"
          status-icon
          :rules="rules"
          ref="loginForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input
              type="text"
              v-model.number="loginForm.phone"
              prefix-icon="el-icon-user-solid"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passWord">
            <el-input
              type="password"
              v-model="loginForm.passWord"
              autocomplete="off"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="forgetPass" @click="lookPass()">忘记密码</div>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="toLogin('loginForm')">登录</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="toRegiste()">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import { reactive, ref,toRefs } from 'vue'
import md5 from 'js-md5'
import { apiToLogin } from '@/api/login.js'
export default {
  name: 'Login',
  // setup(props){
  //   return {
  //   }
  // },
  data(){
    return {
      loginForm:{
        phone:'15817294245',
        passWord:''
      },
      rules:{
        phone:[
          {required:true,message:'请输入手机号',trigger:'blur'},
          {validator:(rule,value,callback)=>{
              const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
              if (reg.test(value)){
                callback()
              }else{
                callback(new Error('请输入正确的手机号码格式!'))
              }
            },trigger: ['change','blur']}
        ],
        passWord: [
            {required:true,message:'请输入密码',trigger:'blur'},
          // {validator:(rule,value,callback)=>{
          //   const reg = /^\w+$/
          //     if(reg.test(value)){
          //       callback()
          //     }else{
          //       callback(new Error('密码格式不对,密码只能由字母,数字,_组成'))
          //     }
          //   }}
        ]
      }
    }
  },
  methods: {
    toLogin (formName) {
      this.$refs[formName].validate(async valid=>{
        if (valid){
          const newForm = JSON.parse(JSON.stringify(this.loginForm))
          newForm.passWord = md5(newForm.passWord)
          const res = await apiToLogin(newForm)
          console.log(res)
          if(res.data.code ===200){
            this.$message.success({
              showClose: true,
              message:'登录成功!'
            })
            this.$router.push('/home')
          }else{
            this.$message.error(
                {showClose: true,
                  message:res.data.msg
                }
            )
          }
        }
      })
    },
    toRegiste(){},
    lookPass () {
      this.$alert('不好意思,暂不支持找回密码,忘了就忘了吧', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100vh;
  background-image: url('../../assets/img/bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  .login-conent {
    min-height: 500px;
    width: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -250px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 30px;
    border-radius: 10px;
    .login-header {
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      margin-bottom: 30px;
      font-weight: 700;
    }
    .inner-conent {
      .el-form-item {
        display: flex;
        justify-content: center;
      }
      .forgetPass {
        color: #999;
        cursor: pointer;
      }
      .el-form-item__content {
        margin-left: 0 !important;
      }
      .el-input {
        width: 300px;
      }
    }
  }
}
</style>
