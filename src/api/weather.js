import { jsonp } from 'vue-jsonp'
import {BASE_KEY} from "@/config/config";
export function apiGetCurrentIpAddress() {
    return jsonp('https://restapi.amap.com/v3/ip',{
        key:BASE_KEY
    })
}
export function apiGetWeather(city) {
    return jsonp('https://restapi.amap.com/v3/weather/weatherInfo',{
            key:BASE_KEY,
            city,
            output: 'JSON',
            extensions: 'base'
    })
}