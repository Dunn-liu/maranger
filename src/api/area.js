import { BASE_KEY } from "@/config/config";
import {jsonp} from 'vue-jsonp'
export function apiGetArea(keywords) {
 return jsonp('https://restapi.amap.com/v3/config/district',{
     key:BASE_KEY,
     keywords:keywords||''
 })
}