<template>
    <div @click="handleCollapse" v-if="!appStore.getMobile">
        <svg-icon size="24" v-show="appStore.getCollapse" name="menu-unfold-one" />
        <svg-icon size="24" v-show="!appStore.getCollapse" name="menu-fold-one" />
    </div>
    <div v-else>
        <svg-icon size="24" @click="handleMobileCollapse(false)" v-show="appStore.getMobileCollapse"
            name="menu-unfold-one" />
        <svg-icon size="24" @click="handleMobileCollapse(true)" v-show="!appStore.getMobileCollapse"
            name="menu-fold-one" />
    </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore()
const handleCollapse = () => {
    appStore.setCollapage()
}
const handleMobileCollapse = (value: boolean) => {
    appStore.setMobileCollapage(value)
}
</script>