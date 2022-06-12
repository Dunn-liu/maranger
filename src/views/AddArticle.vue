<template>
  <div class="add_article my_card">
    <ArticleForm v-model:imgSrc="articleForm.article_cover" v-model:editorType="articleForm.editorType"
      v-model:content="articleForm.article_content" :articleData="articleForm" ref="articleFormRef" />
    <div class="sub_bths">
      <el-button type="success" :loading="submitLoading" @click="submitHandle('publish')">发布</el-button>
      <el-button type="info" :loading="submitLoading" @click="submitHandle('draft')">存为草稿</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, defineAsyncComponent } from "vue";
import dayjs from "dayjs";
import { apiPublishArticle } from "../api/article";
import { useRouter } from "vue-router";
import ComponentLoading from "@/components/ComponentLoading.vue";
import { useUserStore } from "@/store/modules/user";
const ArticleForm = defineAsyncComponent({
  loader: () => import("@/components/FormArticle"),
  loadingComponent: ComponentLoading,
});
const store = useUserStore();
const router = useRouter();
const articleFormRef = ref();
const articleForm = ref<ArticleData>({
  // 文章表单数据
  article_title: "",
  article_content: "",
  article_cover: "",
  author: store.getUserInfo.email,
  author_nickname: store.getUserInfo.user_nickname || "",
  post_date: new Date(),
  edit_date: new Date(),
  article_abstract: "",
  article_keywords: "",
  article_status: 1,
  classifyId: [],
  editorType: 1,
});
const submitLoading = ref(false)
const postArticle = async () => {
  const formValid = await articleFormRef?.value?.validateForm(); // 调用子组件方法
  if (formValid) {
    submitLoading.value = true
    const newFormState = JSON.parse(JSON.stringify(unref(articleForm)))

    newFormState.post_date = dayjs(newFormState.post_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    newFormState.edit_date = newFormState.post_date
    newFormState.classifyId = newFormState.classifyId.join(",");
    const res = await apiPublishArticle(newFormState).finally(() => submitLoading.value = false)
    if (res.code === 200) {
      articleForm.value = {
        article_title: "",
        article_content: "",
        article_cover: "",
        author: store.getUserInfo.email,
        author_nickname: store.getUserInfo.user_nickname || "",
        post_date: new Date(),
        article_abstract: "",
        article_keywords: "",
        article_status: 1,
        classifyId: [],
        editorType: 1,
      }
      // @ts-ignore
      ElNotification({
        type: "success",
        message: newFormState.article_status === 1 ? "发布成功！" : '保存成功！',
        duration: 2000,
      });
      setTimeout(() => {
        router.push("/article/allArticle");
      }, 500)
    }
  }
};
const submitHandle = async (type?: string) => {
  // 发布按钮
  articleForm.value.article_status = type === 'publish' ? 1 : 0;
  await postArticle();
};
</script>

<style scoped lang="scss">
.add_article {
  flex-direction: column;
  align-items: center;
}
</style>
