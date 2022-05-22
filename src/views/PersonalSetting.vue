<template>
  <div class="my_card personal_data">
    <el-tabs tab-position="top" style="width: 100%">
      <el-tab-pane label="基本信息">
        <div class="base_setting">
          <el-form ref="form" :model="userInfo" label-width="80px" label-position="top" style="width: 440px"
            size="small">
            <el-form-item label="角色类型">
              <el-input v-model="AUTH_MAP[userInfo.user_type]" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email" disabled></el-input>
            </el-form-item>
            <!--            <el-form-item label="手机号">-->
            <!--              <el-input v-model="userForm.phone" disabled></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item label="注册时间">
              <el-input v-model="userInfo.create_time" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户昵称">
              <el-input v-model="userInfo.user_nickname"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="userInfo.sex" placeholder="性别">
                <el-option label="男" value="0"></el-option>
                <el-option label="女" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生日">
              <el-date-picker v-model="userInfo.birthday" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="地区">
              <el-cascader :props="props" show-all-levels v-model="userInfo.area" :placeholder="userInfo.area">
              </el-cascader>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="userInfo.address"></el-input>
            </el-form-item>
            <el-form-item label="个性签名">
              <el-input type="textarea" :rows="4" v-model="userInfo.signature"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateInfo">立即更新</el-button>
            </el-form-item>
          </el-form>
          <div class="base_left">
            <div class="avatar">
              <el-avatar icon="el-icon-user-solid" :size="140" fit="cover" :src="userInfo.avatar"></el-avatar>
              <el-upload class="avatar-uploader" :show-file-list="false" :http-request="httpRequest" action="">
                <el-button type="primary" size="small">上传</el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="头像设置"> </el-tab-pane> -->
      <el-tab-pane label="安全设置">
        <el-form :model="passWordForm" :rules="rules" status-icon label-position="top" ref="passWordFormRef"
          style="width: 440px" label-width="100px">
          <el-form-item label="密码" prop="pass">
            <el-input type="password" placeholder="请输入原密码" v-model="passWordForm.pass" show-password autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input type="password" v-model="passWordForm.newPass" autocomplete="off" show-password></el-input>
            <password-strength :password="passWordForm.newPass" />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" show-password v-model="passWordForm.checkPass"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetPass()">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, h, unref } from "vue";
import { useUserStore } from "@/store/modules/user";
import dayjs from "dayjs";
import md5 from "js-md5";
import { AUTH_MAP } from "../config/config";
import useImgRequest from "../hooks/useHttpRequest";
import { apiGetArea } from "../api/area";
import loginOut from "@/utils/loginOut";
import { apiUpdateAvatar, apiUpdateInfo, apiResetPass } from "../api/userInfo";
import { email } from '@/utils/regTest'
import PasswordStrength from "@/components/PasswordStrength.vue";
const userStore = useUserStore();
const passWordFormRef = ref();
const userInfo = ref<UserInfo>({
  address: "",
  area: "",
  auth: "",
  avatar: "",
  birthday: "",
  create_time: "",
  email: "",
  id: '',
  phone: "",
  sex: "",
  signature: "",
  user_nickname: "",
  user_status: '',
  user_type: '',
})
const passWordForm = ref({
  pass: "",
  newPass: "",
  checkPass: "",
})
const rules = ref({
  pass: [
    {
      validator: (_rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  newPass: [
    {
      validator: (_rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入新密码"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  checkPass: [
    {
      validator: (_rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== passWordForm.value.newPass) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
})
const props = ref({
  lazy: true,
  value: "label",
  label: "label",
  lazyLoad: async (node, resolve) => {
    const {
      level,
      data: { key },
    } = node;
    const res = await apiGetArea(key);
    const nodes = res?.districts[0]?.districts.map((item) => {
      return {
        label: item.name,
        key: item.adcode,
        leaf: level >= 3,
      };
    });
    resolve(nodes);
  },
})
const { httpRequest, resSrc } = useImgRequest();
watch(resSrc, async (newVal) => {
  userInfo.value.avatar = newVal;
  const { email } = userInfo.value;
  const res = await apiUpdateAvatar({ email, avatar: newVal });
  if (res.code === 200) {
    await userStore.getUserInfoAction();
  }
});
const getUserInfo = async () => {
  const userinfo = userStore.getUserInfo;
  userinfo.create_time = dayjs(userinfo.create_time).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  userInfo.value = Object.assign({}, userinfo);
};
getUserInfo();
const updateInfo = async () => {
  if (!email(userInfo.value.email)) {
    // @ts-ignore
    ElNotification({
      title: '提示',
      message: h('i', { style: 'color: red' }, '邮箱格式不正确！'),
    })
    return
  }
  const newForm = Object.assign({}, unref(userInfo));
  newForm.birthday = dayjs(newForm.birthday).format("YYYY-MM-DD");
  newForm.area = Array.isArray(newForm.area)
    ? newForm.area.join(" / ")
    : newForm.area;
  const res = await apiUpdateInfo(newForm);
  if (res.code === 200) {
    await userStore.getUserInfoAction();
    getUserInfo();
    // @ts-ignore
    ElMessage({
      type: "success",
      message: "更新成功!",
      showClose: true,
    });
  } else {
    // @ts-ignore
    ElMessage({
      type: "error",
      message: "更新失败!",
      showClose: true,
    });
  }
};
const resetPass = () => {
  passWordFormRef.value.validate(async (valid) => {
    if (valid) {
      const {
        email
      } = unref(userInfo);
      const pass = md5(passWordForm.value.pass);
      const newPass = md5(passWordForm.value.newPass);
      const data = {
        pass,
        newPass,
        email,
      };
      const res = await apiResetPass(data);
      if (res.code === 200) {
        // @ts-ignore
        ElMessage({
          type: "success",
          message: "密码重置成功，请重新登录!",
          showClose: true,
        });
        loginOut();
      }
    }
  });
};
</script>

<style lang="scss">
.personal_data {
  justify-content: left;

  .base_setting {
    display: flex;

    .base_left {
      flex: 1;
      margin-left: 220px;
      margin-top: 40px;

      .avatar {
        /*min-height: 200px;*/
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;

        .el-avatar>img {
          width: 100%;
        }

        .avatar-uploader {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
