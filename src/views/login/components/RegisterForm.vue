<template>
    <div class="register" v-if="props.visible">
        <div class="mb-3 px-4 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">
            注册
        </div>
        <el-form :model="registerForms" :rules="registerRules" ref="formRef">
            <el-form-item class="enter-x" prop="email">
                <el-input type="email" placeholder="邮箱" v-model="registerForms.email" autocomplete="new-password">
                </el-input>
            </el-form-item>
            <el-form-item class="enter-x" prop="code">
                <el-row class="w-full">
                    <el-col :span="17">
                        <el-input type="text" placeholder="验证码" v-model="registerForms.code"
                            autocomplete="new-password">
                        </el-input>
                    </el-col>
                    <el-col :span="7" style="height:40px">
                        <el-button type="primary" class="w-full" @click="sendCode" :disabled="isActive">{{
                                isActive ? `${countdown}s后重新发送` : '发送验证码'
                        }}</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <!-- <el-form-item class="enter-x" prop="user_nickname">
                <el-input type="text" placeholder="用户名" v-model="registerForms.user_nickname"></el-input>
            </el-form-item> -->
            <el-form-item class="enter-x" prop="passWord">
                <el-input placeholder="密码" type="password" show-password v-model="registerForms.passWord"
                    autocomplete="new-password"></el-input>
                <password-strength v-if="registerForms.passWord.trim()" :password="registerForms.passWord" />
            </el-form-item>
            <el-form-item class="enter-x" prop="checkPassWord">
                <el-input placeholder="确认密码" type="password" show-password v-model="registerForms.checkPassWord"
                    autocomplete="new-password"></el-input>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" :loading="loading" @click="register" class="w-full mb-4">注册</el-button>
        </div>
        <el-button :loading="loading" @click="updateVisible('login')" class="w-full">返回</el-button>
    </div>
</template>
<script setup lang="ts">
import { ref, watch, unref } from "vue";
import type { FormInstance } from "element-plus";
import { useIntervalFn } from '@vueuse/core';
import { apiRegister, apiSendCode } from "@/api/login.js";
import { code, email } from "@/utils/regTest";
import PasswordStrength from "@/components/PasswordStrength.vue";
import { guid } from '@/utils'
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['updataVisible'])
const formRef = ref<FormInstance>();
const loading = ref(false);
const registerForms = ref({
    user_nickname: guid(),
    code: "",
    passWord: "",
    checkPassWord: "",
    email: "",
    sex: "male",
});
const registerRules = ref({
    user_nickname: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        {
            min: 3,
            max: 8,
            message: "长度在 3 到 5 个字符",
            trigger: "blur",
        },
    ],
    code: [
        { required: true, message: "请输入验证码", trigger: "blur" },
        {
            // @ts-ignore
            validator: (rule, value, callback) => {
                if (code(value)) {
                    callback();
                } else {
                    callback(new Error("请输入正确的验证码格式!"));
                }
            },
            trigger: ["change", "blur"],
        },
    ],
    passWord: [
        { required: true, message: "请输入密码", trigger: "blur" },
        {
            // @ts-ignore
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
            // @ts-ignore
            validator: (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请再次输入密码"));
                } else if (value !== unref(registerForms).passWord) {
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
});
const updateVisible = (type) => {
    emit('updataVisible', type)
}
const countdown = ref(60)
const { pause, resume, isActive } = useIntervalFn(() => {
    countdown.value--;
}, 1000)
pause();
watch(countdown, (newValue: number) => {
    if (newValue === 0) {
        pause();
        countdown.value = 60;
    }
})
// 注册
const register = () => {
    formRef?.value?.validate(async (valid) => {
        if (valid) {
            loading.value = true
            const newRegisterForm = JSON.parse(
                JSON.stringify(registerForms)
            );
            newRegisterForm.checkPassWord = undefined;
            const res = await apiRegister(newRegisterForm);
            if (res.code === 200) {
                loading.value = false
                // @ts-ignore
                ElMessage.success({
                    showClose: true,
                    message: "注册成功,去登录吧!",
                });
                formRef?.value?.resetFields();
                // state.isregister = false;
                // state.loginForms.email = newRegisterForm.email;
            } else {
                loading.value = false
            }
        }
    });
};
const sendCode = () => {
    const { email } = registerForms.value;
    if (!email) {
        // @ts-ignore
        ElMessage.error({
            showClose: true,
            message: "请先输入邮箱地址！",
        });
        return;
    }
    formRef?.value?.validateField('email', async (isValid: boolean) => {
        if (isValid) {
            try {
                const res = await apiSendCode({ email, type: 1 });
                if (res.code === 200) {
                    resume()
                    // @ts-ignore
                    ElMessage.success({
                        showClose: true,
                        message: "验证码发送成功！",
                    });
                }
            } catch (e) { }
        }
    })
};
</script>
<style lang="scss">
</style>
