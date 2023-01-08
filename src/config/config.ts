const BASE_KEY = "c3dd05d9b509aded6b1956e961145ff2";
const AUTH_MAP = {
  "1": "超级管理员",
  "2": "管理员",
  "3": "用户",
};
export { BASE_KEY, AUTH_MAP };

// * 首页地址（默认）
export const HOME_URL: string = "/home";

// * Tabs（黑名单地址，不需要添加到 tabs 的路由地址）
export const TABS_BLACK_LIST: string[] = [
  "/403",
  "/404",
  "/500",
  "/layout",
  "/login",
  "/dataScreen",
];
