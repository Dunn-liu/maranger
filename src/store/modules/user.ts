import { defineStore } from "pinia";
import { store } from "../pinia";
import router from "@/router/index";
import { localRemove, localGet, localSet } from "@/utils/local";
import { apiGetUserAuth, apiGetUserInfo } from "@/api/userInfo.js";
import { formatRouterTree } from "@/utils/routerFormat";
import { isEmpty } from "@/utils/is";

interface UserState {
  userInfo: Nullable<any>;
  userRouters: any[];
  hasAuth: boolean;
}

export const useUserStore = defineStore({
  id: "user",
  state: (): UserState => ({
    // user info
    userInfo: {},
    // routes
    userRouters: [],
    hasAuth: false,
  }),
  getters: {
    getUserInfo(): any {
      if (isEmpty(this.userInfo)) {
        return localGet("userInfo");
      }
      return this.userInfo;
    },
    getRoleList(): any[] {
      return this.userRouters;
    },
    getHasAuth(): boolean {
      return this.hasAuth;
    },
  },
  actions: {
    setRoleList(userRouters: any[]) {
      this.userRouters = [...userRouters];
    },
    setUserInfo(info: any | null) {
      this.userInfo = info;
      localSet("userInfo", this.userInfo);
    },
    setHasAuth(auth: boolean) {
      this.hasAuth = auth;
    },
    async getAuthRouterAction() {
      const res = await apiGetUserAuth(localGet("email"));
      const list = formatRouterTree(res.auth);
      this.setRoleList(list);
      this.setHasAuth(true);
    },
    async getUserInfoAction(): Promise<any> {
      if (!localGet("email")) return null;
      const resUser = await apiGetUserInfo(localGet("email"));
      const userInfo = resUser?.data ?? {};
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    loginOutAction() {
      localRemove("token");
      this.setUserInfo(null);
      this.setHasAuth(false);
      this.setRoleList([]);
      router.push("/login");
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      //@ts-ignore
      ElMessageBox.confirm(`确认退出当前账号?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.loginOutAction();
        })
        .catch(() => {});
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
