<template>
    <router-view />
</template>

<script>
import {defineComponent} from 'vue'
 export default defineComponent({
   name:'app',
   setup(){
     return {
     }
   }
 })

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style lang="scss">
.my_card{
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #EBEEF5;
  background-color: #FFF;
}
</style>
