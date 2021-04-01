<template>
  <div class="calendar">
    <div class="date my_card">
      <el-calendar v-model="date">
        <template #dateCell="{data}">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : '' }}
          </p>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script>
import {defineComponent,reactive,toRefs} from 'vue'
export default defineComponent({
  name: "Calendar",
  setup(){
    const state = reactive({
      date:new Date()
    })
    return{
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="scss">
  .calendar{
    .date{
      .el-calendar {
        width: 80%;
      }
    }
  }

</style>
