<template>
	<div class="py-2 px-1 h-12 flex items-center">
		<img class=" w-8 h-8 mx-3" src="@/assets/img/logo_touming.png" alt="logo" />
		<span class="text-sm font-bold text-white" v-show="!isCollapse">Dunn Blog</span>
	</div>
</template>

<script setup lang="ts">
defineProps<{ isCollapse: boolean }>();
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
