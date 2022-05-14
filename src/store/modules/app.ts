import type { Ref } from "vue";
import { defineStore } from "pinia";
import { store } from "../pinia";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
interface AppState {
  isCollapse: boolean;
  mobileCollapse: boolean;
  mdMobile: Ref<boolean>;
}
export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    isCollapse: false,
    mobileCollapse: false,
    mdMobile: breakpoints.smaller("md"),
  }),
  getters: {
    getCollapse(): boolean {
      return this.isCollapse;
    },
    getMobileCollapse(): boolean {
      return this.mobileCollapse;
    },
    getMobile(): boolean {
      return this.mdMobile;
    },
  },
  actions: {
    setCollapage() {
      this.isCollapse = !this.isCollapse;
    },
    setMobileCollapage(value: boolean) {
      this.mobileCollapse = value;
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
