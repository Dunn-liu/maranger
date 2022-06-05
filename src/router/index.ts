import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessage } from "element-plus";
import { localGet, localRemove } from "@/utils/local";
import { generateRouter } from "@/utils/routerFormat";
import { useUserStore } from "@/store/modules/user";
const addRouters = (_route) => {
  _route.forEach((item) => {
    if (!item.hidden) {
      router.addRoute(item.parentName, item);
    }
  });
};
const Layout = () => import("@/layout/index.vue");
const routes = [
  {
    path: "/",
    name: "Home",
    meta: { title: "首页" },
    redirect: "/home",
    component: Layout,
    children: [
      {
        path: "/home",
        name: "Calendar",
        component: () => import("../views/Calender.vue"),
      },
    ],
  },
  // {
  //   path: "/article",
  //   name: "Article",
  //   meta: { title: "文章管理" },
  //   redirect: "/article/allArticle",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "/article/allArticle",
  //       name: "AllArticle",
  //       component: () => import("../views/AllArticle.vue"),
  //       meta: {
  //         title: "所有文章",
  //         icon: "editor",
  //         keepAlive: true,
  //       },
  //     },
  //     {
  //       path: "/article/addArticle",
  //       name: "AddArticle",
  //       component: () => import("../views/AddArticle.vue"),
  //       meta: {
  //         title: "添加文章",
  //         icon: "file-addition-one",
  //         keepAlive: true,
  //       },
  //     },
  //   ],
  // },
  {
    path: "/login",
    name: "Login",
    meta: { title: "登录" },
    component: () => import("../views/login/Login.vue"),
  },
  // 404页面
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    meta: { title: "404 NotFound" },
    component: () => import("../views/NotFound.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const userStore = useUserStore();
  if (localGet("token")) {
    // 已登录
    if (to.path.includes("/login")) {
      // 已登录不可访问登录页
      next({ path: "/home" }); // 跳转到首页
      NProgress.done();
    } else {
      // 异步获取路由
      if (userStore.getHasAuth) {
        // 已有路由
        next();
      } else {
        //异步获取路由
        try {
          await userStore.getAuthRouterAction();
          const accessRouters = generateRouter(userStore.getRoleList);
          addRouters(accessRouters);
          next({ path: to.path, replace: true });
        } catch (e) {
          localRemove("token");
          next({
            path: "/login",
            params: {
              redirect: to.path,
            },
          });
        }
      }
    }
  } else {
    // 未登录
    if (to.path.includes("/login")) {
      // 未登录登录页直接访问
      next();
    } else {
      // 其他页面
      ElMessage.error("请先登录!");
      userStore.loginOutAction();
      next({
        path: "/login",
        params: {
          redirect: to.path,
        },
      });
      NProgress.done();
    }
  }
});
router.afterEach((to) => {
  document.title = to.meta.title as string;
  NProgress.done();
});
export default router;
