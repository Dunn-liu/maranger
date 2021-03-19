<template>
  <div class="register">
<div class="register-content">
  <h3 style="text-align: center">注册</h3>
  <el-form label-position="right" label-width="80px">
    <el-form-item label="用户名" >
      <el-input type="text" v-model="registerForm.user_nickname"></el-input>
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
  </el-form>
</div>
  </div>
</template>

<script>
export default {
name: "Register",
  data(){
  return {
    registerForm:{
      user_nickname:'',
      phone:'',
      passWord:'',
      checkPassWord:'',
      email:'',
      sex:''
    }
  }
  }
}
</script>

<style lang="scss">
.register {
  width: 100vw;
  height: 100vh;
  background-image: url('../../assets/img/bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  .register-content {
    width: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 45px 45px 65px;
  }
}

</style>
