<template>
  <div class="calendar">
    <div class="date my_card">
      <div class="inner">
        <div class="location">
          <div>
            <i class="el-icon-location-information"></i>&nbsp;&nbsp;
            {{ weather.province }} - {{ weather.city }}
          </div>
          <div class="weather">
            今日天气&nbsp;:&nbsp;<span :style="{ color: '#00bb00' }">{{ weather.weather }}</span> &nbsp;今日温度&nbsp;:&nbsp;<span
              :style="{ color: '#00bb00' }">{{ weather.temperature }}℃</span>
            &nbsp;今日湿度&nbsp;:&nbsp;<span :style="{ color: '#00bb00' }">{{ weather.humidity }}%</span>
            &nbsp;今日风向&nbsp;:&nbsp;<span :style="{ color: '#00bb00' }">{{ weather.winddirection }}风</span>
          </div>
        </div>
        <el-calendar v-model="date">
          <template #dateCell="{ data }">
            <p :class="data.isSelected ? 'is-selected' : ''" @click=handle(data)>
              {{ data.day.split('-').slice(1).join('-') }}<br>
            </p>
          </template>
        </el-calendar>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { apiGetCurrentIpAddress, apiGetWeather } from '@/api/weather'
export default defineComponent({
  name: "Calendar",
  setup() {
    const state = reactive({
      date: new Date(),
      weather: {}
    })
    onMounted(async () => {
      try {
        const ipInfo = await apiGetCurrentIpAddress()
        const { adcode } = ipInfo
        const weatherRes = await apiGetWeather(adcode)
        state.weather = Object.assign(state.weather, weatherRes.lives[0])

      } catch (e) {
        console.log('e==============>>>>>>', e)
      }
    })
    const handle = (data) => {
      console.log(data)
    }

    return {
      ...toRefs(state),
      handle
    }
  }
})
</script>

<style scoped lang="scss">
.calendar {
  .inner {
    width: 80%;

    .location {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
    }

    .date {
      .el-calendar {
        width: 80%;
      }
    }
  }
}
</style>
