<template>
  <div class="login">
    <div class="login-conent" v-if="!isregister">
      <div class="login-header">
        登录
      </div>
      <div class="inner-conent">
        <el-form
            :model="loginForm"
          status-icon
          :rules="loginRules"
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
          <el-form-item prop="capCode" label="验证码" class="imgCode">
                <el-input
                    type="text"
                    v-model="loginForm.capCode"
                    autocomplete="off"
                    prefix-icon="el-icon-coin"
                ></el-input>
                <img style="width: 112px;height: 40px" :src=codeSrc @click="changeCaptcha">
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
            <div class="forgetPass" @click="lookPass()">忘记密码</div>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="toLogin('loginForm')">登录</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="toRegister()">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="login-conent" v-if="isregister">
      <el-button  icon="el-icon-arrow-left" size="mini" @click="isregister=false" class="return-login">返回</el-button>
      <div class="login-header">
        注册
      </div>
      <el-form label-position="right" label-width="80px" :model="registerForm" :rules="registerRules" ref="registerForm">
        <el-form-item label="用户名" >
          <el-input type="text" v-model="registerForm.user_nickname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" style="justify-content: left;padding-left: 110px">
          <el-radio-group v-model="registerForm.sex">
          <el-radio label="male">男</el-radio>
          <el-radio label="female">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input type="text" v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="registerForm.passWord" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="registerForm.checkPassWord" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="registerForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
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
  created() {

  },
  data(){
    return {
      loginForm:{
        phone:'15817294245',
        passWord:'',
        capCode:'',
      },
      registerForm:{
        user_nickname:'',
        phone:'',
        passWord:'',
        checkPassWord:'',
        email:'',
        sex:''
      },
      rememberPassword:false,
      loginRules:{
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
        ],
        capCode:[
          {required:true,message:'请输入验证码',trigger:'blur'}
        ]
      },
      registerRules:{
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
        ],
      },
      codeSrc:"http://localhost:8000/captcha",
      isregister:false
    }
  },
  methods: {
    toLogin (formName) {
      this.$refs[formName].validate(async valid=>{
        if (valid){
          this.loginForm.passWord = md5(this.loginForm.passWord)
          // const newForm = JSON.parse(JSON.stringify(this.loginForm))
          // newForm.passWord = md5(newForm.passWord)
          const res = await apiToLogin(this.loginForm)
          this.$store.commit('saveInfo',res.data.info)
          if(res.data.code ===200){
            this.$message.success({
              showClose: true,
              message:'登录成功!'
            })
            this.$router.push('/home')
          }else{
            this.changeCaptcha()
            this.$message.error(
                {showClose: true,
                  message:res.data.msg
                }
            )
          }
        }
      })
    },
    toRegister(){
      this.isregister=true
    },
    register(){
      console.log(this.registerForm)
      this.$alert('注册成功', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      })
    },
    lookPass () {
      this.$alert('不好意思,暂不支持找回密码,忘了就忘了吧', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      })
    },
    setCookie(){},
    changeCaptcha(){
    this.codeSrc = "http://localhost:8000/captcha?"+Date.now()
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
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .return-login{
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .login-header {
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 700;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }

    .el-input {
      width: 300px;
    }
    .el-form-item {
      display: flex;
      justify-content: center;
    }
    .inner-conent {
      .forgetPass {
        display: inline-block;
        margin-left: 20px;
        color: #999;
        cursor: pointer;
      }
      .imgCode {
        .el-form-item__content{
          display: flex;
          align-items: center;
        }
        .el-input--prefix {
          width: 190px;
        }
      }
    }
  }
}
</style>
