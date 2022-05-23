import axios from "axios";
import { localGet } from "./local";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";

const fetch = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
});
fetch.interceptors.request.use(
  (config) => {
    config.headers.authorization = "Bearer " + localGet("token") || "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
fetch.interceptors.response.use(
  (response) => {
    if (response.data && response.data.code !== 200) {
      ElMessage({
        message: response.data.msg || "error",
        type: "error",
        showClose: true,
      });
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore();
      ElMessage({
        message: "登录已过期,请重新登录!",
        type: "error",
        showClose: true,
      });
      userStore.loginOutAction();
    } else {
      ElMessage({
        message: error?.response?.data?.msg ?? "未知错误",
        type: "error",
        showClose: true,
      });
    }
    return error;
  }
);
export default fetch;
