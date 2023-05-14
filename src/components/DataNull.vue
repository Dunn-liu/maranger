<template>
  <div class="data_null">
    <img class="icon" src="../assets/img/data_null.jpg" alt="no_data" />
    <div class="message">{{ message }}</div>
  </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue'
    export default defineComponent ({
        name: "DataNull",
        props: {
            message: {
                type:String,
                default: function () {
                    return 'Hey, there is no data'
                }
            }
        }
    })
</script>

<style lang="less" scoped>
.data_null {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .icon {
    width: 150px;
    height: 150px;
  }

  .message {
    line-height: 32px;
    text-align: center;
    color: #6a737d;
  }
}
</style>