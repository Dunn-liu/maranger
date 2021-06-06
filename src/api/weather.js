import { jsonp } from 'vue-jsonp'
const key = 'c3dd05d9b509aded6b1956e961145ff2'
export function apiGetCurrentIpAddress() {
    return jsonp('https://restapi.amap.com/v3/ip',{
        key
    })
}
export function apiGetWeather(city) {
    return jsonp('https://restapi.amap.com/v3/weather/weatherInfo',{
            key,
            city,
            output: 'JSON',
            extensions: 'base'
    })
}