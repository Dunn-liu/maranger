<template>
  <div class="login" v-if="!props.visible">
    <div class="mb-3 px-4 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">
      登录
    </div>
    <el-form :model="loginForms" :rules="loginRules" ref="formRef" class="p-4 enter-x" label-position="right">
      <el-form-item prop="email" class="enter-x">
        <el-input type="text" placeholder="邮箱" v-model="loginForms.email"></el-input>
      </el-form-item>
      <el-form-item prop="passWord" class="enter-x">
        <el-input show-password type="password" placeholder="密码" v-model="loginForms.passWord" autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item prop="capCode" class="imgCode enter-x">
        <el-row>
          <el-col :span="18">
            <el-input class="w-full" type="text" placeholder="验证码" v-model="loginForms.capCode" autocomplete="off">
            </el-input>
          </el-col>
          <el-col :span="6">
            <img style="height: 40px" :src="codeSrc" @click="changeCaptcha" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="enter-x">
        <div class="flex justify-between w-full">
          <el-checkbox v-model="loginForms.isKeepLogin">7天内保持登录</el-checkbox>
          <el-button type="text" class="forgetPass" @click="lookPass()">忘记密码?</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="w-full" :loading="loginLoading" @click="toLogin">{{ loginLoading ? "登录中" : "登录"
        }}</el-button>
      </el-form-item>
      <el-row justify="center" class="enter-x">
        <el-col :md="8" :sm="24">
          <el-button class="w-full"> 二维码登录 </el-button>
        </el-col>
        <el-col :md="4" :sm="24" class="!my-2 !lg:my-0 xs:mx-0 md:mx-2">
          <el-button class="w-full" @click="updateVisible"> 注册 </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, unref } from "vue";
import type { FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import md5 from "js-md5";
import { apiToLogin } from "@/api/login.js";
import { localSet, localGet } from "@/utils/local";
import { email } from "@/utils/regTest";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:visible'])
const store = useStore();
const router = useRouter();
const formRef = ref<FormInstance>();
const codeSrc = ref(`${window.location.origin}/api/captcha`);
const loginLoading = ref(false);
const loginForms = ref({
  email: localGet("email") || "",
  passWord: "",
  capCode: "",
  isKeepLogin: false,
});
const loginRules = ref({
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      // @ts-ignore
      validator: (rule, value, callback) => {
        if (email(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱地址!"));
        }
      },
      trigger: ["change", "blur"],
    },
  ],
  passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
  capCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});
const updateVisible = () => {
  emit('update:visible', true)
}
const toLogin = () => {
  formRef?.value?.validate(async (valid) => {
    if (valid) {
      loginLoading.value = true;
      const newForm = JSON.parse(JSON.stringify(unref(loginForms)));
      newForm.passWord = md5(newForm.passWord);
      try {
        const res = await apiToLogin(newForm);
        if (res.code === 200) {
          localSet("token", res.data.token);
          localSet("email", newForm.email);
          // 登录成功,获取用户信息
          await store.dispatch("getUserInfo");
          ElMessage.success({
            showClose: true,
            message: "登录成功!",
          });
          loginLoading.value = false;
          await router.push("/home");
        } else {
          loginLoading.value = false;
          changeCaptcha();
        }
      } catch (e) {
        loginLoading.value = false;
        changeCaptcha();
      }
    }
  });
};
// 忘记密码
const lookPass = () => {
  ElMessage("请联系管理员重置密码！");
};
// 点击更换验证码
const changeCaptcha = () => {
  const src = `${window.location.origin}/api/captcha`
  codeSrc.value = `${src}?${Date.now()}`;
};
</script>
<style lang="scss">
</style>
