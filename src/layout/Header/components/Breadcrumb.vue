<template>
	<el-breadcrumb :separator-icon="ArrowRight">
		<transition-group name="breadcrumb" mode="out-in">
			<el-breadcrumb-item :to="{ path: HOME_URL }" key="/home">首页</el-breadcrumb-item>
			<template v-for="item in matched" :key="item.path">
				<el-breadcrumb-item v-if="item.children.length">
					<el-dropdown>
						<span>
							{{ item.meta.title }}
						</span>
						<template #dropdown>
							<el-dropdown-item v-for="i in item.children" :key="i.path"
								:disabled="currentPath === i.path" @click="$router.push(i.path)">
								{{ i?.meta?.title }}
							</el-dropdown-item>
						</template>
					</el-dropdown>
				</el-breadcrumb-item>
				<el-breadcrumb-item v-else :to="{ path: item.path }">
					{{ item.meta.title }}
				</el-breadcrumb-item>
			</template>
		</transition-group>
	</el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
import { HOME_URL } from "@/config/config";
const route = useRoute();
const currentPath = computed(() => route.path)
const matched = computed(() => route.matched.filter(item => item?.meta?.title !== "首页"));
</script>
