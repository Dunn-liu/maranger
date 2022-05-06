<template>
    <div class="register" v-if="props.visible">
        <div class="mb-3 px-4 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">
            二维码登录
        </div>
        <div>
            <QrCode class="enter-x flex justify-center xl:justify-start" :width="260" :value="qrCodeUrl"
                :logo="LogoImg" />
            <div class="enter-x text-xs text-center mb-4">扫码后点击"确认"，即可完成登录</div>
        </div>
        <el-button @click="updateVisible('login')" class="w-full enter-x">返回</el-button>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import QrCode from '@/components/Qrcode';
import LogoImg from '@/assets/img/logo_touming.png';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['updataVisible'])
const qrCodeUrl = ref('https://blog.liuqidong.com/')
const updateVisible = (type) => {
    emit('updataVisible', type)
}
</script>
