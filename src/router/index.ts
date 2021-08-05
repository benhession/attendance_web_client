import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/Login.vue";
import Classes from "../views/Classes.vue";
import QrWindow from "@/views/QrWindow.vue";

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
  {
    path: "/qrcode",
    name: "QrWindow",
    component: QrWindow,
    props: (route) => ({
      qrImageB64: route.query.qrImageB64,
      classTitle: route.query.classTitle,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
