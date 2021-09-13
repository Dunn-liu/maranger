<template>
  <div class="login">
    <div class="login-conent" v-if="!isregister">
      <div class="login-header">
        <div>DunnBlog</div>
        &nbsp;&nbsp;&nbsp;{{ headerText }}
      </div>
      <el-form
        :model="loginForms"
        status-icon
        :rules="loginRules"
        ref="loginForm"
        label-width="80px"
        class="demo-ruleForm"
        label-position="right"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input
            type="text"
            v-model="loginForms.phone"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input
            show-password
            type="password"
            v-model="loginForms.passWord"
            autocomplete="off"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="capCode" label="验证码" class="imgCode">
          <el-input
            type="text"
            v-model="loginForms.capCode"
            autocomplete="off"
            prefix-icon="el-icon-coin"
          ></el-input>
          <img
            style="width: 112px; height: 40px"
            :src="codeSrc"
            @click="changeCaptcha"
          />
        </el-form-item>
        <el-form-item style="margin-left: 80px">
          <el-checkbox v-model="loginForms.isKeepLogin"
            >7天内保持登录</el-checkbox
          >
        </el-form-item>
      </el-form>
      <el-button
        type="success"
        :loading="loginLoading"
        @click="toLogin('loginForm')"
        :disabled="loginDisable"
        style="width: 250px; margin-left: 10px"
        >{{ loginLoading ? "登录中" : "登录" }}</el-button
      >
      <div class="login-bottom">
        <el-button type="text" class="forgetPass" @click="lookPass()"
          >忘记密码?</el-button
        >
        <el-button type="text" @click="toRegister">去注册</el-button>
      </div>
    </div>
    <!--    </div>-->
    <div class="register-conent" v-if="isregister">
      <el-button
        icon="el-icon-arrow-left"
        size="mini"
        @click="isregister = false"
        class="return-login"
        >返回</el-button
      >
      <div class="login-header">
        <div>DunnBlog</div>
        &nbsp;&nbsp;&nbsp;{{ headerText }}
      </div>
      <el-form
        label-position="right"
        label-width="80px"
        :model="registerForms"
        :rules="registerRules"
        ref="registerForm"
      >
        <el-form-item label="用户名" prop="user_nickname">
          <el-input
            type="text"
            v-model="registerForms.user_nickname"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="registerForms.sex">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="text" v-model="registerForms.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input
            type="password"
            show-password
            v-model="registerForms.passWord"
            autocomplete="off"
          ></el-input>
          <password-strength :password="registerForms.passWord" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassWord">
          <el-input
            type="password"
            show-password
            v-model="registerForms.checkPassWord"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="email"
            v-model="registerForms.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="success" @click="register" style="width: 250px"
        >注册</el-button
      >
    </div>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import md5 from "js-md5";
import { apiToLogin, apiRegister } from "@/api/login.js";
import { localSet, localGet } from "@/utils/local";
import PasswordStrength from "@/components/PasswordStrength.vue";

export default defineComponent({
  name: "Login",
  components: {
    PasswordStrength,
  },
  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const loginForm = ref(null);
    const registerForm = ref(null);
    const loginLoading = ref(false);
    const __DEV__ = import.meta.env.MODE === "development";
    const state = reactive({
      loginForms: {
        phone: localGet("phone") || "",
        passWord: "",
        capCode: "",
        isKeepLogin: false,
      },
      registerForms: {
        user_nickname: "",
        phone: "",
        passWord: "",
        checkPassWord: "",
        email: "",
        sex: "male",
      },
      loginRules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              const reg =
                /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("请输入正确的手机号码格式!"));
              }
            },
            trigger: ["change", "blur"],
          },
        ],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
        capCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      registerRules: {
        user_nickname: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              const reg =
                /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("请输入正确的手机号码格式!"));
              }
            },
            trigger: ["change", "blur"],
          },
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              const reg = /^\w+$/;
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("密码格式不对,密码只能由字母,数字,_组成"));
              }
            },
          },
        ],
        checkPassWord: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== state.registerForms.passWord) {
                callback(new Error("两次输入密码不一致!"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
      codeSrc: __DEV__
        ? "http://localhost:8000/captcha"
        : "https://admin.codespring.top/api/captcha",
      isregister: false,
      headerText: "登录",
      loginDisable: false
    });
    watch(
      () => state.isregister,
      (value) => {
        document.title = value ? "注册" : "登录";
        state.headerText = value ? "注册" : "登录";
      }
    );
    // 去登录
    const toLogin = () => {
      loginForm.value.validate(async (valid) => {
        if (valid) {
          loginLoading.value = true;
          state.loginDisable = true;
          const newForm = JSON.parse(JSON.stringify(state.loginForms));
          newForm.passWord = md5(newForm.passWord);
          const res = await apiToLogin(newForm);
          if (res.code === 200) {
            localSet("token", res.data.token);
            localSet("phone", newForm.phone);
            // 登录成功,获取用户信息
            await store.dispatch("getUserInfo");
            ElMessage.success({
              showClose: true,
              message: "登录成功!",
            });
            loginLoading.value = false;
            state.loginDisable = false;
            await router.push("/home");
          } else {
            loginLoading.value = false;
            state.loginDisable = false;
            changeCaptcha();
          }
        }
      });
    };
    // 打开注册页面
    const toRegister = () => {
      state.isregister = true;
      document.title = "注册";
    };
    // 注册
    const register = () => {
      registerForm.value.validate(async (valid) => {
        if (valid) {
          const newRegisterForm = JSON.parse(
            JSON.stringify(state.registerForms)
          );
          newRegisterForm.checkPassWord = undefined;
          const res = await apiRegister(newRegisterForm);
          if (res.code === 200) {
            ElMessage.success({
              showClose: true,
              message: "注册成功,去登录吧!",
            });
            registerForm.value.resetFields();
            state.isregister = false;
            state.loginForms.phone = newRegisterForm.phone;
          }
        }
      });
    };
    // 忘记密码
    const lookPass = () => {
      ElMessage("不好意思,暂不支持找回密码,忘了就忘了吧");
    };
    // 设置cookies
    const setCookie = () => {};
    // 清除cookies
    const claerCookies = () => {};
    // 点击更换验证码
    const changeCaptcha = () => {
      state.codeSrc = `${state.codeSrc}?${Date.now()}`;
    };
    return {
      loginForm,
      registerForm,
      ...toRefs(state),
      toLogin,
      toRegister,
      register,
      lookPass,
      changeCaptcha,
      loginLoading,
    };
  },
});
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/img/bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  /*background-color: #409EFF;*/
  .login-conent,
  .register-conent {
    min-height: 500px;
    width: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -280px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    flex-direction: column;
    .login-header {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      margin-bottom: 10px;
      color: #3c8dbc;
    }
    .return-login {
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .login-bottom {
      margin-top: 20px;
      width: 300px;
      display: flex;
      justify-content: space-between;
    }
    .el-form {
      width: 400px;
    }
    .el-form-item__content {
      margin-left: 0 !important;
      // display: flex;
      // justify-content: space-between;
      // align-items: center;
    }
    .el-input {
      width: 300px;
    }
    .el-form-item {
      display: flex;
      justify-content: left;
      width: 400px;
    }
    .forgetPass {
      color: #999;
      cursor: pointer;
    }
    .imgCode {
      .el-form-item__content {
        display: flex;
        align-items: center;
      }

      .el-input--prefix {
        width: 190px;
      }
    }
  }
}
</style>
