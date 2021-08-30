<template>
  <div class="add_article my_card">
    <ArticleForm
      :articleData="articleForm"
      @get-url="getUrl"
      @get-content="getContent"
      @get-valid="getFormValid"
      @getEditorType="getEditorType"
      ref="articleFormRef"
    />
    <div class="sub_bths">
      <el-button type="success" @click="publishArticle">发布</el-button>
      <el-button type="info" @click="saveDraft">存为草稿</el-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";
import dayjs from "dayjs";
import { apiPublishArticle } from "../api/article";
import { useRouter } from "vue-router";
import Loading from "@/components/Loading.vue";
const ArticleForm = defineAsyncComponent({
  loader: () => import("@/components/ArticleForm.vue"),
  loadingComponent: Loading,
});
export default {
  name: "AddArticle",
  components: { ArticleForm },
  setup() {
    const store = useStore();
    const router = useRouter();
    const articleFormRef = ref(null);
    let formValid = null;
    const state = reactive({
      articleForm: {
        // 文章表单数据
        article_title: "",
        article_content: "",
        article_cover: "",
        author: store.state.userinfo.phone,
        author_nickname: store.state.userinfo.user_nickname || "",
        edit_date: new Date(),
        article_abstract: "",
        article_keywords: "",
        article_status: 1,
        classifyId: [],
        editorType: 0,
      },
      text: "",
    });
    const getFormValid = (e) => {
      // 获取表单验证结果
      formValid = e;
    };
    const getEditorType = (e) => {
      state.articleForm.editorType = e;
    };
    const getUrl = (e) => {
      state.articleForm.article_cover = e;
    };
    const getContent = (e) => {
      state.articleForm.article_content = e;
    };
    const postArticle = async () => {
      articleFormRef.value.validateForm(); // 调用子组件方法
      if (!formValid) {
        ElNotification({
          type: "error",
          message: "请检查表单内容!",
          duration: "2000",
        });
      } else {
        const newFormState = JSON.parse(JSON.stringify(state.articleForm))

        newFormState.post_date = dayjs(newFormState.post_date).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        newFormState.classifyId = newFormState.classifyId.join(",");
        const res = await apiPublishArticle(newFormState);
        if (res.code === 200) {
          router.push("/article/allArticle");
          ElNotification({
            type: "success",
            message: "发布成功!",
            duration: 2000,
          });
        }
      }
    };
    const publishArticle = async () => {
      // 发布按钮
      state.articleForm.article_status = 1;
      await postArticle();
    };
    const saveDraft = async () => {
      state.articleForm.article_status = 0;
      await postArticle();
    };
    return {
      articleFormRef,
      ...toRefs(state),
      publishArticle,
      saveDraft,
      getFormValid,
      getEditorType,
      getUrl,
      getContent,
    };
  },
};
</script>

<style scoped lang="scss">
.add_article {
  flex-direction: column;
  align-items: center;
}
</style>
