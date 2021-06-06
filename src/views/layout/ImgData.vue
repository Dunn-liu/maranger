<template>
<div class="my_card img_data">
    <div class="upload">
        <el-button type="success" size="medium" @click="dialogVisible = true">上传</el-button>
    </div>
    <el-table
            :data="articleData"
            style="width: 100%"
            max-height="600"
            v-loading="loading"
            element-loading-text="拼命加载中"
            @selection-change="handleSelectionChange"
            ref="tableRef"
            :default-sort = "{prop: 'id', order: 'descending'}"
            @sort-change="handlerSort"
            border>
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column
                fixed
                prop="id"
                label="ID"
                width="100"
                sortable="custom"
        >
        </el-table-column>
        <el-table-column
                prop="article_title"
                label="图片名"
                show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
                prop="classifyId"
                label="图片路径"
        >
<!--            <template v-slot="scope">-->
<!--                <template v-for="(item,index) in scope.row.classifyId">-->
<!--                    {{ filterClassify(item).classifyName }}-->
<!--                    {{scope.row.classifyId.length===index+1?'':','}}-->
<!--                </template>-->
<!--            </template>-->
        </el-table-column>
        <el-table-column
                prop="author_nickname"
                label="上传时间"
                width="100"
        >
        </el-table-column>
        <el-table-column
                prop="article_content"
                label="内容"
                show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
                label="操作"
        >
            <template v-slot="scope">
                <el-button type="primary"  size="mini" @click="editArticle(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="page_nation" v-if="totalNum>0">
        <el-pagination
                background
                layout="prev, pager, next ,sizes "
                :page-sizes="[10, 20]"
                :page-size="queryData.limit"
                :current-page="queryData.page"
                :total="totalNum"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
        >
        </el-pagination>
    </div>
    <el-dialog
            title="提示"
            v-model="dialogVisible"
            width="30%">
<!--        <Upload @getSrc="getSrc" :src="articleData.article_cover"></Upload>-->
        <div class="dialog_content">
            <Upload></Upload>
        </div>
        <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
    </span>
        </template>
    </el-dialog>
</div>
</template>

<script>
import {defineComponent,reactive,toRefs} from 'vue'
import Upload from "@/components/Upload.vue";
export default defineComponent({
  name: "ImgData",
    components:{
        Upload,
    },
  setup(){
      const state = reactive({
          dialogVisible: false
      })
      return {
          ...toRefs(state)
      }
  }
})
</script>

<style scoped lang="scss">
    .img_data {
        flex-direction: column;
        .upload{
            padding-bottom: 10px;
        }
        .dialog_content{
            display: flex;
            justify-content: center;
        }
    }

</style>
