import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/Login.vue";
import Classes from "../views/Classes.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:pathMatch( )",
    name: "Login",
    component: Login,
    alias: "/:pathMatch(.*)",
  },
  {
    path: "/classes",
    name: "Classes",
    component: Classes,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
