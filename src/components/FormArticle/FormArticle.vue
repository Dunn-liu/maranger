<template>
  <el-form :model="articleData" :rules="rules" ref="articleFormRef" label-width="80px" class="article_form"
    label-position="top">
    <div style="margin: 15px 0">
      带 <span style="color: #f56c6c">*</span> 号的为必填项
    </div>
    <el-form-item label="文章标题" prop="article_title">
      <el-input v-model="articleData.article_title"></el-input>
    </el-form-item>
    <el-form-item label="文章分类" prop="classifyId">
      <el-select v-model="articleData.classifyId" placeholder="请选择" multiple collapse-tags>
        <el-option v-for="item in classify" :key="item.id" :label="item.classifyName" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文章封面" prop="article_cover">
      <div>
        <div class="cover_placeholder">
          <img v-if="articleData.article_cover" :src="articleData.article_cover" class="avatar" />
        </div>
        <div>
          <Upload @uploadSuc="uploadSuc" />
          <el-button type="primary" plain @click="chooseCloud" style="margin-left: 12px">从图库选择</el-button>
        </div>
      </div>
      <el-drawer title="图库" v-model="cloudGallery.dialogGalleryVisible" direction="rtl" size="35%">
        <div style="width:100%">
          <el-input placeholder="请输入内容" v-model="cloudGallery.query.describe" style="margin: 12px;width: 91%"
            @keyup.enter.native="onSearch">
          </el-input>
          <div class="drawer__content" v-if="cloudGalleryData.length">
            <template v-for="item in cloudGalleryData" :key="item.id">
              <el-card :body-style="{ padding: '12px' }" class="cloud_item">
                <img style="width: 100%; height: 116px" :src="item.src" class="image" />
                <h4 style="text-align: center; line-height: 14px; margin: 16px 0">
                  {{ item.describe }}
                </h4>
                <div style="color: #000; text-align: center">
                  <svg-icon name="copy" @click="copySrc(item.src)" class=" cursor-pointer" />
                </div>
              </el-card>
            </template>
          </div>
          <template v-else>
            <DataNull />
          </template>
        </div>
        <el-pagination layout="prev, pager, next" :hide-on-single-page="true" background :total="cloudGallery.total"
          :page-size="12" @current-change="pageChange" style="margin-top: 20px">
        </el-pagination>
      </el-drawer>
    </el-form-item>
    <el-form-item label="文章内容" prop="article_content">
      <div class="changeEditor">
        <span>切换编辑器</span>
        <el-select v-model="editorType" @change="editorChange">
          <el-option :value="0" label="WangEditor"></el-option>
          <el-option :value="1" label="VMdEditor"></el-option>
        </el-select>
      </div>
      <WEditor v-if="isWangEditor" :article-data="articleData" @get-editor="getEditor" ref="WEditorRef" />
      <v-md-editor v-if="!isWangEditor" v-model="articleData.article_content" height="400px" ref="MdEditor"
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save"
        :disabled-menus="[]" @upload-image="handleUploadImage"></v-md-editor>
    </el-form-item>
    <el-form-item label="作者" prop="author_nickname">
      <el-input v-model="articleData.author_nickname" disabled></el-input>
    </el-form-item>
    <el-form-item label="内容摘要" prop="article_abstract">
      <el-input type="textarea" v-model="articleData.article_abstract"></el-input>
    </el-form-item>
    <el-form-item label="关键词">
      <el-input v-model="articleData.article_keywords"></el-input>
    </el-form-item>
    <el-form-item label="发布时间" prop="post_date">
      <el-date-picker v-model="articleData.post_date" type="datetime" format="YYYY-MM-DD HH:mm:ss" placeholder="选择更新时间"
        :shortcuts="shortcuts">
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, unref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Compressor from "compressorjs";
import Upload from "../Upload.vue";
import WEditor from "./components/WEditor.vue";
import DataNull from "../DataNull.vue";
import { apiUploadImg, apiGetImages } from "@/api/image";
import { apiGetClassify } from "@/api/article";
import dayjs from "dayjs";
const props = defineProps<{
    articleData: ArticleData,
    editorType: number,
    imgSrc: string,
    content: string
}>()
const emit = defineEmits<{
    (e: 'update:editorType', type: number): void
    (e: 'update:imgSrc', src: string): void
    (e: 'update:content', content: string): void
}>()
const articleFormRef = ref();
const WEditorRef = ref();
const MdEditor = ref(null);
const shortcuts = ref([ // 时间选择器额外配置
    {
        text: "今天",
        value: new Date(),
    },
    {
        text: "昨天",
        value: (() => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
        })(),
    },
    {
        text: "一周前",
        value: (() => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            return date;
        })(),
    },
])
const classify = ref<ArticleClassify[]>() // 文章分类数据
const rules = ref({
    article_title: [
        { required: true, message: "请输入文章标题!", trigger: "blur" },
        { min: 5, message: "文章标题至少为5个字符", trigger: "blur" },
    ],
    article_content: [
        { required: true, message: "请输入文章内容!", trigger: "blur" },
        { min: 20, message: "文章内容至少为20个字符", trigger: "blur" },
    ],
    classifyId: [
        {
            type: "array",
            required: true,
            message: "请选择文章分类!",
            trigger: "blur",
        },
    ],
    author_nickname: [
        { required: true, message: "请输入作者", trigger: "blur" },
    ],
    article_abstract: [
        { required: true, message: "请输入内容摘要", trigger: "blur" },
        { min: 10, message: "内容摘要至少为10个字符", trigger: "blur" },
    ],
    post_date: [
        {
            type: "date",
            required: true,
            message: "请输入日期",
            trigger: "blur",
        },
    ],
})
const cloudGallery = reactive({
    dialogGalleryVisible: false,
    query: {
        currentPage: 1,
        limit: 12,
        type: '1',
        describe: ''
    },
    total: 0,
});
const cloudGalleryData = ref<ImageType[]>([])
const isWangEditor = ref(props.articleData.editorType === 0)
const editorType = ref(props.articleData.editorType)
onMounted(async () => {
    // 获取文章分类
    const res = await apiGetClassify();
    classify.value = [...res.data];
});
const editorChange = (val: number) => {
    ElMessageBox.confirm(
        `切换编辑器后，保存内容将被清空，确定要切换吗?`,
        "提示",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        }
    )
        .then(() => {
            isWangEditor.value = !isWangEditor.value;
            emit("update:content", "");
        })
        .catch(() => {
            editorType.value = val === 0 ? 1 : 0
        });
    emit("update:editorType", unref(editorType));
};
const validateForm = async () => {
    // 表单验证
    return articleFormRef.value.validate().catch(() => {
        // @ts-ignore
        ElNotification({
            type: "error",
            message: "请检查表单内容!",
            duration: 2000,
        });
    })
};
const uploadSuc = (e: string): void => {
    // 获取图片上传src
    emit("update:imgSrc", e);
};
const getEditor = (e: string): void => {
    emit("update:content", e);
};
const handleUploadImage = (_event, insertImage, files) => {
    new Compressor(files[0], {
        quality: 0.6,
        async success(result: File) {
            const formData = new FormData();
            formData.append("file", result, result.name);
            try {
                const res = await apiUploadImg(formData);
                insertImage({ url: res.src });
            } catch (e) {
                ElMessage.error({
                    message: '图片上传失败！',
                    type: "error",
                    showClose: true,
                });
            }
        },
        error(err) {
            console.log("err", err.message);
        },
    });
};

// 从在线图库选择
const chooseCloud = async () => {
    cloudGallery.dialogGalleryVisible = true;
    if (!cloudGalleryData.value.length) {
        await fetchImages();
    }
};
const onSearch = async () => {
    cloudGallery.query.currentPage = 1;
    await fetchImages();
}

// 图库页码改变
const pageChange = async (currentPage: number) => {
    cloudGallery.query.currentPage = currentPage;
    await fetchImages();
};

//复制云图库链接
const copySrc = (src: string) => {
    emit("update:imgSrc", src);
    cloudGallery.dialogGalleryVisible = false;
};

// 获取图片数据
const fetchImages = async () => {
    const { query } = cloudGallery;
    try {
        const res = await apiGetImages(query);
        res.data?.forEach((item) => {
            item.update_time = dayjs(item.update_time).format(
                "YYYY-MM-DD HH:mm:ss"
            );
        });
        cloudGalleryData.value = [...res.data];
        cloudGallery.total = res.pageNation.total;
    } catch (e) {
        ElMessage.error("图片获取失败！");
        console.log(e);
    }
};
defineExpose({
    validateForm
})
</script>

<style lang="less" scoped>
.article_form {
  width: 80%;
  margin: 0 auto;

  :deep(.el-date-picker) {
    z-index: 10000;
  }

  .changeEditor {
    margin-bottom: 10px;

    :deep(.el-select) {
      margin: 0 10px;
    }
  }

  .cover_placeholder {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 180px;
    height: 120px;
    overflow: hidden;
    margin-bottom: 12px;

    .avatar {
      width: 180px;
      height: 120px;
      display: block;
    }
  }

  /* table 样式 */
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }

  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }

  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }

  /* blockquote 样式 */
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  /* code 样式 */
  code {
    display: inline-block;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }

  pre code {
    display: block;
  }

  /* ul ol 样式 */
  ul,
  ol {
    margin: 10px 0 10px 20px;
  }
}

:deep(.el-drawer__header) {
  font-size: 22px;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 24px !important;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 0 !important;
}

:deep(.el-drawer__body) {
  height: calc(100% - 73px);
  overflow-x: scroll;
}

.drawer__content {
  display: flex;
  flex-wrap: wrap;
  padding: 15px;

  .cloud_item {
    width: 140px;
    height: 220px;
    margin-bottom: 12px;
    margin-right: 12px;

    .image {
      vertical-align: middle;
    }

    :deep(.el-card) {
      height: 100%;

      &:hover {
        border-color: transparent;
        box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%),
          0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%);
      }
    }
  }

  &::after {
    content: "";
    width: 150px;
  }
}

.sub_bths {
  width: 20%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
</style>
