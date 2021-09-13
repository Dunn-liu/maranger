<template>
    <el-dialog title="预览" v-model="centerDialogVisible" :destroy-on-close="true" width="80%" center>
            <el-scrollbar class="dialog-center ">
            <v-md-preview :text="text"></v-md-preview>
            </el-scrollbar>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
<!--      <el-button type="primary" @click="centerDialogVisible = false"-->
<!--      >打印</el-button-->
    </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
    export default {
        name: "PreView",
        props:{
            text:{
                type: String,
                default:  ''
            },
            centerDialogVisible:{
                type: Boolean,
                default: false
            }
        },
        setup(){

        }
    }
</script>

<style scoped lang="scss">
    .dialog-center {
        max-height: 60vh !important;
        overflow: auto;
    }

</style>