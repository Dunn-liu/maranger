<template>
  <div class="my_card">网站设置</div>
  <div v-html="currentData"></div>
</template>

<script>
import {onMounted, reactive, toRefs} from "vue";
import {apiGetArticle} from "../../api/article";

export default {
  name: "WebSetting",
  setup(){
    const state = reactive({
      currentData:null
    })
    onMounted(async ()=>{
      const res = await apiGetArticle({id:24})
      console.log(res)
      state.currentData = res.data[0].article_content
      console.log(state.currentData)
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>

</style>
