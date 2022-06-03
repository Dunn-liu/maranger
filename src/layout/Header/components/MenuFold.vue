<template>
    <div @click="menuStore.setCollapse()">
        <svg-icon size="18" v-show="isCollapse" name="menu-unfold-one" />
        <svg-icon size="18" v-show="!isCollapse" name="menu-fold-one" />
    </div>
    <!-- <div v-else>
        <svg-icon size="18" @click="appStore.setMobileCollapage(false)" v-show="appStore.getMobileCollapse"
            name="menu-unfold-one" />
        <svg-icon size="18" @click="appStore.setMobileCollapage(true)" v-show="!appStore.getMobileCollapse"
            name="menu-fold-one" />
    </div> -->
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { MenuStore } from "@/store/modules/menu";
const menuStore = MenuStore();
const isCollapse = computed((): boolean => menuStore.isCollapse);
</script>