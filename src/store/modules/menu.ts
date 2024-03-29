import { defineStore } from "pinia";
export interface MenuState {
  isCollapse: boolean;
  menuList: Menu.MenuOptions[];
}
// MenuStore
export const MenuStore = defineStore({
  id: "MenuState",
  state: (): MenuState => ({
    // menu collapse
    isCollapse: false,
    // menu List
    menuList: [],
  }),
  getters: {},
  actions: {
    async setCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    async setMenuList(menuList: Menu.MenuOptions[]) {
      this.menuList = menuList;
    },
  },
});
