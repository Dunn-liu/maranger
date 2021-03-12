<template>
<div class="login">
  <div class="login-conent">
    <div class="login-header">
    登录
    </div>
    <div class="inner-conent">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.userName" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
          <el-form-item>
            <div class="forgetPass" @click="lookPass()">忘记密码</div>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="toLogin()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
// import {reactive} from 'vue'
export default {
  name: "Login",
  data () {
    return {
      ruleForm:{
        userName:'15817294245',
        pass:''
      },
      rules:{}
    }
  },
  methods:{
    toLogin(){
      console.log(123)
    },
    lookPass(){
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
  background-image:url("../../assets/img/bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  .login-conent{
    min-height: 500px;
    width: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -250px;
    background-color: rgba(255,255,255,0.8);
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
      .forgetPass{
        color: #999;
        cursor: pointer;
      }
      .el-form-item__content{
        margin-left: 0 !important;
      }
      .el-input {
        width: 300px;
      }
    }
  }
}
</style>
