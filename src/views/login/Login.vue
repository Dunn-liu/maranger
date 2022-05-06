<template>
  <div class="relative contentBox w-full h-full px-4 overflow-hidden">
    <div class="enter-x flex items-center mt-4 xl:hidden">
      <img class="w-12 h-12 mr-4" src="../../assets/img/logo_touming.png" />
      <span class="text-white">Blog</span>
    </div>
    <div class="container relative h-full py-2 mx-auto sm:px-10">
      <div class="flex h-full">
        <div class="hidden min-h-full pl-4 mr-4 xl:flex xl:flex-col xl:w-6/12">
          <div class="my-auto">
            <img alt="博客" src="../../assets/svg/login-box-bg.svg" class="w-1/2 -mt-16 -enter-x" />
            <div class="mt-10 font-medium text-white -enter-x">
              <span class="inline-block mt-4 text-3xl">Dunn Blog</span>
            </div>
            <div class="mt-5 font-normal text-white text-md dark:text-gray-500 -enter-x">
              博客后台管理系统
            </div>
          </div>
        </div>
        <div class="flex w-full h-full py-5 xl:h-auto xl:py-0 xl:my-0 xl:w-6/12">
          <div
            class="form-conent relative w-full px-5 py-8 mx-auto my-auto rounded-md shadow-md xl:ml-16 xl:bg-transparent sm:px-8 xl:p-4 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto enter-x">
            <LoginForm :visible="isLogin" @updata-visible="updataVisible" />
            <RegisterForm :visible="isregister" @updata-visible="updataVisible" />
            <QrLogin :visible="isQrLogin" @updata-visible="updataVisible" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import QrLogin from "./components/QrLogin.vue";
const isregister = ref(false)
const isLogin = ref(true)
const isQrLogin = ref(false)
const updataVisible = (type: 'login' | 'register' | 'qr') => {
  if (type === 'login') {
    isQrLogin.value = false
    isregister.value = false
    isLogin.value = true
  }
  if (type === 'register') {
    isLogin.value = false
    isQrLogin.value = false
    isregister.value = true
  }
  if (type === 'qr') {
    isLogin.value = false
    isregister.value = false
    isQrLogin.value = true
  }

}
</script>

<style lang="scss">
.contentBox {
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-left: -48%;
    background-image: url(@/assets/svg/login-bg.svg);
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    content: "";

    @media (max-width: 1200px) {
      display: none;
    }
  }

  @media (max-width: 1200px) {
    background-color: #293146;

    .form-conent {
      background-color: #fff;
    }
  }

  input:not([type="checkbox"]) {
    min-width: 360px;

    @media (max-width: 1200px) {
      min-width: 320px;
    }

    @media (max-width: 992px) {
      min-width: 260px;
    }

    @media (max-width: 768px) {
      min-width: 240px;
    }

    @media (max-width: 576px) {
      min-width: 160px;
    }
  }

  input[placeholder="验证码"] {
    min-width: 288px;

    @media (max-width: 1200px) {
      min-width: 211px;
    }

    @media (max-width: 992px) {
      min-width: 270px;
    }

    @media (max-width: 768px) {
      min-width: 174px;
    }

    @media (max-width: 576px) {
      min-width: 120px;
    }
  }

  .register {
    input[placeholder="验证码"] {
      min-width: 242px;

      @media (max-width: 1200px) {
        min-width: 211px;
      }

      @media (max-width: 992px) {
        min-width: 270px;
      }

      @media (max-width: 768px) {
        min-width: 174px;
      }

      @media (max-width: 576px) {
        min-width: 120px;
      }
    }
  }

}
</style>
