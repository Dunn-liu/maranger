<template>
<div class="my_card img_data">
    <div class="upload">
        <el-button type="success" size="medium" @click="dialogVisible = true">上传</el-button>
    </div>
    <el-table
            :data="imgData"
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
                prop="name"
                label="图片名"
                show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
                prop="src"
                label="图片路径"
        >
            <template v-slot="scope">
                <el-link :href="scope.row.src" :download="scope.row.src" :underline="false" type="primary">{{scope.row.src}}</el-link>
            </template>
        </el-table-column>
        <el-table-column
                prop="update_time"
                label="上传时间"
        >
        </el-table-column>
        <el-table-column
                label="内容"
                show-overflow-tooltip
        >
            <template v-slot="scope">
                <el-image
                        style="width: 200px; height: 100px"
                        :src="scope.row.src"
                        :preview-src-list="[scope.row.src]">
                </el-image>
            </template>
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
import {defineComponent,reactive,toRefs,onMounted} from 'vue'
import Upload from "@/components/Upload.vue";
import {apiGetImages} from "@/api/image";
export default defineComponent({
  name: "ImgData",
    components:{
        Upload,
    },
  setup(){
      const state = reactive({
          imgData:[],
          query: {
              id: '',
              update_time: '',
              page: 1,
              limit: 10,
              orderSort:{},
          },
          dialogVisible: false
      })
      const fetchImages = async () => {
          const { query } = state
          const res = await apiGetImages(query)
          state.imgData = [...res.data]
          console.log(res)
      }
      onMounted(async () => {
          await fetchImages()
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
